const nodemailer = require('nodemailer');

function buildSmtpTransport() {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_APP_PASSWORD?.trim();

  if (!emailUser || !emailPass) {
    throw new Error('Email not configured: set EMAIL_USER and EMAIL_APP_PASSWORD in Railway variables.');
  }

  const host = process.env.EMAIL_HOST?.trim() || 'smtp-relay.brevo.com';
  const port = Number(process.env.EMAIL_PORT) || 587;
  const secure = process.env.EMAIL_SECURE === 'true';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: true,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 45000,
  });
}

async function sendTransactionalEmail({ to, subject, text, html }) {
  const transporter = buildSmtpTransport();
  const from = process.env.EMAIL_FROM?.trim() || `"Wishlink Support" <${process.env.EMAIL_USER?.trim()}>`;
  await transporter.sendMail({ from, to, subject, text, html });
}

module.exports = { sendTransactionalEmail };