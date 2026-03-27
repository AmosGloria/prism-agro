const { Resend } = require('resend');

let resend;

/**
 * Initialize Resend client (singleton)
 */
const getResendClient = () => {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY');
    }

    resend = new Resend(process.env.RESEND_API_KEY);
  }

  return resend;
};

/**
 * Generic Send Email Function
 */
const sendMail = async (to, subject, html) => {
  try {
    if (!to || !subject || !html) {
      throw new Error('Missing required email parameters');
    }

    const client = getResendClient();

    const { data, error } = await client.emails.send({
      from: process.env.SMTP_USER || '<PrismAgro <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log(`[${new Date().toISOString()}] Email sent →`, {
      to,
      id: data?.id,
    });

    return {
      success: true,
      messageId: data?.id,
    };

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Email error →`, {
      to,
      error: error.message,
    });

    throw new Error(`Failed to send mail: ${error.message}`);
  }
};

module.exports = {
  sendMail
};