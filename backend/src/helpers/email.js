const nodemailer = require('nodemailer');

const sendMail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true, // Use SSL for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
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