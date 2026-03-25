const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export const authApi = {
  me: () => request("/auth/me"),
  login: (body: object) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body: object) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  updateUser: (id: string, body: object) =>
    request(`/users/${id}`, { method: "PUT", body: JSON.stringify(body) }),
};

// Listings
export const listingsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/listings${qs}`);
  },
  getByFarmer: (farmerId: string) => request(`/listings/farmer/${farmerId}`),
  getById: (id: string) => request(`/listings/${id}`),
  create: (body: object) =>
    request("/listings", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: object) =>
    request(`/listings/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: string) => request(`/listings/${id}`, { method: "DELETE" }),
};

// Orders
export const ordersApi = {
  getBuyerOrders: () => request("/orders/buyer"),
  getFarmerOrders: () => request("/orders/farmer"),
  getById: (id: string) => request(`/orders/${id}`),
  create: (body: object) =>
    request("/orders", { method: "POST", body: JSON.stringify(body) }),
  updateStatus: (id: string, status: string, extra?: object) =>
    request(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, ...extra }),
    }),
};

// Delivery / Logistics
export const deliveryApi = {
  getAvailableLoads: () => request("/listings?forLogistics=true"),
  claimLoad: (orderId: string) =>
    request("/delivery/create", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),
  confirmPickup: (orderId: string) =>
    request(`/delivery/${orderId}/ship`, { method: "PATCH" }),
  confirmDelivery: (orderId: string, code: string) =>
    request(`/delivery/${orderId}/confirm`, {
      method: "PATCH",
      body: JSON.stringify({ releaseCode: code }),
    }),
  getDelivery: (orderId: string) => request(`/delivery/${orderId}`),
};

// Admin
export const adminApi = {
  getUsers: () => request("/admin/users"),
  getOrders: () => request("/admin/orders"),
  getPayments: () => request("/admin/payments"),
  resolveDispute: (body: object) =>
    request("/admin/resolve-dispute", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
