const nodemailer = require('nodemailer');

const sendMail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g. mail.izonmfb.com.ng
      port: 587,
      secure: false, // must be false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // helps with some self-signed certs (common in webmail)
      },
      connectionTimeout: 10000,
    });

    const mailOptions = {
      from: `PrismAgro <${process.env.SMTP_FROM_EMAIL || 'riches.arise@izonmfb.com.ng'}>`,
      to: email,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[${new Date().toISOString()}] Email sent successfully to ${email}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error sending mail:`, error);
    throw new Error(`Failed to send mail: ${error.message}`);
  }
};

module.exports = { sendMail };