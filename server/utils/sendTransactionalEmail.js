const nodemailer = require('nodemailer');

function buildSmtpTransport() {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_APP_PASSWORD?.trim();
  
  if (!emailUser || !emailPass) {
    const err = new Error('Email not configured: Please set EMAIL_USER and EMAIL_APP_PASSWORD.');
    err.code = 'EMAIL_NOT_CONFIGURED';
    throw err;
  }

  // Default to Brevo host if not explicitly provided
  const host = process.env.EMAIL_HOST?.trim() || 'smtp-relay.brevo.com';
  const port = Number(process.env.EMAIL_PORT) || 587;
  const secure = process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 45000,
  });
}

/**
 * Production-friendly transactional email via SMTP (Brevo or generic).
 * @param {{ to: string, subject: string, text: string, html: string }} opts
 */
async function sendTransactionalEmail({ to, subject, text, html }) {
  const transporter = buildSmtpTransport();
  
  const rawFrom = process.env.EMAIL_FROM?.trim() || process.env.EMAIL_USER?.trim() || 'no-reply@wishlink.com';
  const fromAddr = rawFrom.includes('<') ? rawFrom : `"Wishlink Support" <${rawFrom}>`;
  
  await transporter.sendMail({
    from: fromAddr,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendTransactionalEmail };
