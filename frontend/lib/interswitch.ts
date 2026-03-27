/**
 * lib/interswitch.ts
 *
 * PrismAgro × Interswitch Integration
 * ─────────────────────────────────────
 * API 1 — Accept Payments (Web Checkout / IPG)
 *   Buyer pays at checkout → funds held in PrismAgro Interswitch merchant account
 *   Docs: https://docs.interswitchgroup.com/docs/web-checkout
 *
 * API 2 — Send Money (Single Transfer)
 *   On delivery confirmation → instantly disburse to farmer's bank account
 *   Docs: https://docs.interswitchgroup.com/docs/single-transfer
 *
 * Sandbox base URL  : https://sandbox.interswitchng.com
 * Production base URL: https://api.interswitchgroup.com
 */

// ─── Config (set in .env.local) ────────────────────────────────────────────────
const ISW_BASE_URL =
  process.env.NEXT_PUBLIC_ISW_ENV === "production"
    ? "https://api.interswitchgroup.com"
    : "https://sandbox.interswitchng.com";

const ISW_CLIENT_ID =
  process.env.ISW_CLIENT_ID ?? "";
const ISW_SECRET_KEY =
  process.env.ISW_SECRET_KEY ?? "";
const ISW_MERCHANT_CODE = process.env.ISW_MERCHANT_CODE ?? "";
const ISW_PAY_ITEM_ID = process.env.ISW_PAY_ITEM_ID ?? "";

// Sandbox test values from Interswitch docs
export const ISW_TEST_CARDS = {
  success: {
    pan: "5061020000000000094",
    expiry: "2004",
    cvv: "000",
    pin: "1111",
    otp: "123456",
  },
  failure: {
    pan: "5061020000000000086",
    expiry: "2004",
    cvv: "000",
    pin: "1111",
  },
  verve: {
    pan: "5061260000000000000",
    expiry: "2006",
    cvv: "000",
    pin: "1111",
    otp: "123456",
  },
};

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface ISWPaymentRequest {
  amount: number; // in KOBO (multiply NGN by 100)
  txnRef: string; // unique transaction reference
  customerEmail: string;
  customerName: string;
  description: string;
  currency?: string; // default NGN
  redirectUrl: string; // where to send buyer after payment
}

export interface ISWPaymentResponse {
  paymentUrl: string; // redirect buyer here
  txnRef: string;
  amount: number;
}

export interface ISWTransferRequest {
  amount: number; // in KOBO
  recipientAccountNumber: string;
  recipientBankCode: string;
  recipientName: string;
  narration: string;
  txnRef: string;
  senderName?: string;
}

export interface ISWTransferResponse {
  responseCode: string; // '00' = success
  responseDescription: string;
  transactionReference: string;
  amount: number;
}

export interface ISWStatusResponse {
  responseCode: string;
  responseDescription: string;
  transactionDate: string;
  amount: number;
  txnRef: string;
}

export interface ISWBankListItem {
  bankCode: string;
  bankName: string;
}

// ─── Auth: Get OAuth2 access token ─────────────────────────────────────────────
async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${ISW_CLIENT_ID}:${ISW_SECRET_KEY}`,
  ).toString("base64");

  const res = await fetch(`${ISW_BASE_URL}/passport/oauth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "profile",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ISW Auth failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

// ─── API 1: Initialize Web Checkout payment ────────────────────────────────────
/**
 * Creates a payment URL using Interswitch Web Checkout.
 * The buyer is redirected to this URL to complete payment via card/USSD/transfer.
 *
 * Flow:
 *   1. Server calls initializePayment() → gets paymentUrl
 *   2. Frontend redirects buyer to paymentUrl
 *   3. Interswitch redirects back to redirectUrl with txnRef
 *   4. Server calls verifyPayment(txnRef) to confirm
 */
export async function initializePayment(
  req: ISWPaymentRequest,
): Promise<ISWPaymentResponse> {
  const token = await getAccessToken();

  // Amount must be in kobo (NGN × 100)
  const amountInKobo = Math.round(req.amount * 100);

  // Build the standard Interswitch payment payload
  const payload = {
    merchantCode: ISW_MERCHANT_CODE,
    payableCode: ISW_PAY_ITEM_ID,
    amount: amountInKobo,
    transactionReference: req.txnRef,
    currency: req.currency ?? "NGN",
    customerEmail: req.customerEmail,
    customerName: req.customerName,
    description: req.description,
    redirectUrl: req.redirectUrl,
  };

  const res = await fetch(
    `${ISW_BASE_URL}/collections/api/v1/payments/selar/initiate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    // Fallback: construct standard IPG URL for demo/hackathon
    const ipgUrl = buildIPGUrl(req, amountInKobo);
    return { paymentUrl: ipgUrl, txnRef: req.txnRef, amount: req.amount };
  }

  const data = await res.json();
  return {
    paymentUrl: data.redirectUrl ?? buildIPGUrl(req, amountInKobo),
    txnRef: req.txnRef,
    amount: req.amount,
  };
}

/**
 * Builds the standard Interswitch IPG redirect URL.
 * Used as fallback and for sandbox testing.
 */
function buildIPGUrl(req: ISWPaymentRequest, amountInKobo: number): string {
  const params = new URLSearchParams({
    merchantcode: ISW_MERCHANT_CODE,
    payItemID: ISW_PAY_ITEM_ID,
    amount: String(amountInKobo),
    txnref: req.txnRef,
    currency: req.currency ?? "566", // 566 = NGN ISO code
    site_redirect_url: req.redirectUrl,
    cust_email: req.customerEmail,
    cust_name: req.customerName,
  });
  return `${ISW_BASE_URL}/collections/w/pay?${params.toString()}`;
}

// ─── API 1b: Verify payment status ─────────────────────────────────────────────
/**
 * Query the status of a payment by transaction reference.
 * Call this after the buyer is redirected back from Interswitch.
 * responseCode '00' = success, any other = failed/pending.
 */
export async function verifyPayment(
  txnRef: string,
  amount: number,
): Promise<ISWStatusResponse> {
  const token = await getAccessToken();
  const amountInKobo = Math.round(amount * 100);

  const res = await fetch(
    `${ISW_BASE_URL}/collections/api/v1/gettransaction.json?merchantcode=${ISW_MERCHANT_CODE}&transactionreference=${txnRef}&amount=${amountInKobo}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    throw new Error(`ISW verify failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    responseCode: data.ResponseCode ?? data.responseCode,
    responseDescription: data.ResponseDescription ?? data.responseDescription,
    transactionDate: data.TransactionDate ?? new Date().toISOString(),
    amount: (data.Amount ?? amountInKobo) / 100,
    txnRef,
  };
}

// ─── API 2: Send Money — disburse to farmer after delivery confirmed ────────────
/**
 * Transfers funds from PrismAgro's Interswitch wallet to the farmer's bank account.
 * Called by the backend when:
 *   - Buyer clicks "Confirm Delivery"
 *   - 6-digit release code is verified
 *   - Order status → COMPLETED
 *
 * responseCode '00' = success
 */
export async function disburseFarmerPayment(
  req: ISWTransferRequest,
): Promise<ISWTransferResponse> {
  const token = await getAccessToken();
  const amountInKobo = Math.round(req.amount * 100);

  const payload = {
    mac: generateMAC(req.txnRef, amountInKobo),
    initiatingEntityCode: ISW_MERCHANT_CODE,
    terminalId: "PrismAgro01",
    beneficiaryAccountName: req.recipientName,
    beneficiaryAccountNumber: req.recipientAccountNumber,
    beneficiaryBankCode: req.recipientBankCode,
    transferCode: `pa-DISBURSE-${req.txnRef}`,
    amount: amountInKobo,
    narration: req.narration,
    senderName: req.senderName ?? "PrismAgro Escrow Vault",
    currencyCode: "566", // NGN
    transactionReference: req.txnRef,
  };

  const res = await fetch(
    `${ISW_BASE_URL}/api/v2/merchant/transfer/send-money`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ISW Transfer failed: ${err}`);
  }

  const data = await res.json();
  return {
    responseCode: data.responseCode,
    responseDescription: data.responseDescription,
    transactionReference: data.transactionReference ?? req.txnRef,
    amount: req.amount,
  };
}

// ─── Get list of Nigerian banks ─────────────────────────────────────────────────
/**
 * Fetches all bank codes for the bank selector in farmer settings.
 * Used to validate account numbers before saving.
 */
export async function getBankList(): Promise<ISWBankListItem[]> {
  const token = await getAccessToken();

  const res = await fetch(`${ISW_BASE_URL}/api/v2/quickteller/banks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return NIGERIAN_BANKS_FALLBACK;

  const data = await res.json();
  return data.banks ?? data ?? NIGERIAN_BANKS_FALLBACK;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Generate a MAC (Message Authentication Code) for transfer requests.
 * Format: SHA-512(clientId + txnRef + amount + terminalId + secretKey)
 * This runs server-side only.
 */
function generateMAC(txnRef: string, amountInKobo: number): string {
  if (typeof window === "undefined") {
    const crypto = require("crypto");
    const raw = `${ISW_CLIENT_ID}${txnRef}${amountInKobo}PrismAgro01${ISW_SECRET_KEY}`;
    return crypto.createHash("sha512").update(raw).digest("hex");
  }
  return ""; 
}

/**
 * Generate a unique transaction reference for each payment.
 * Format: pa-{timestamp}-{random}
 */
export function generateTxnRef(prefix = "pa"): string {
  const ts = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ts}-${random}`;
}

/**
 * Convert NGN to kobo (Interswitch uses kobo for all amounts)
 */
export const toKobo = (ngn: number) => Math.round(ngn * 100);
export const fromKobo = (kobo: number) => kobo / 100;

// ─── Fallback bank list (shown when API is unavailable) ────────────────────────
export const NIGERIAN_BANKS_FALLBACK: ISWBankListItem[] = [
  { bankCode: "044", bankName: "Access Bank" },
  { bankCode: "014", bankName: "Afribank Nigeria" },
  { bankCode: "023", bankName: "CitiBank Nigeria" },
  { bankCode: "063", bankName: "Diamond Bank" },
  { bankCode: "050", bankName: "EcoBank Nigeria" },
  { bankCode: "070", bankName: "Fidelity Bank" },
  { bankCode: "011", bankName: "First Bank of Nigeria" },
  { bankCode: "214", bankName: "First City Monument Bank" },
  { bankCode: "058", bankName: "Guaranty Trust Bank" },
  { bankCode: "030", bankName: "Heritage Bank" },
  { bankCode: "301", bankName: "Jaiz Bank" },
  { bankCode: "082", bankName: "Keystone Bank" },
  { bankCode: "526", bankName: "Kuda Bank" },
  { bankCode: "101", bankName: "Providus Bank" },
  { bankCode: "076", bankName: "Polaris Bank" },
  { bankCode: "221", bankName: "Stanbic IBTC Bank" },
  { bankCode: "068", bankName: "Standard Chartered" },
  { bankCode: "232", bankName: "Sterling Bank" },
  { bankCode: "100", bankName: "SunTrust Bank" },
  { bankCode: "032", bankName: "Union Bank of Nigeria" },
  { bankCode: "033", bankName: "United Bank For Africa" },
  { bankCode: "215", bankName: "Unity Bank" },
  { bankCode: "035", bankName: "Wema Bank" },
  { bankCode: "057", bankName: "Zenith Bank" },
  { bankCode: "000014", bankName: "OPay" },
  { bankCode: "000013", bankName: "GTBank (737)" },
  { bankCode: "000016", bankName: "Moniepoint" },
];
