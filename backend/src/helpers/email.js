const nodemailer = require('nodemailer');

const sendMail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: 'astrosoft <info@astrosoft.io>',
      to: email,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to', email);
  } catch (error) {
    console.error('Error sending mail:', error);
    throw new Error('Failed to send mail');
  }
};

module.exports = { sendMail };