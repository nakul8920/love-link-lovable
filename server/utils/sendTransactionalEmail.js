const https = require('https');
const nodemailer = require('nodemailer');

async function postJsonResend(path, body, apiKey) {
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.resend.com',
        port: 443,
        path,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => {
          data += c;
        });
        res.on('end', () => {
          let parsed = {};
          try {
            parsed = data ? JSON.parse(data) : {};
          } catch {
            parsed = { raw: data };
          }
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            const err = new Error(parsed.message || `Resend failed (${res.statusCode})`);
            err.code = 'RESEND_ERROR';
            err.responseBody = parsed;
            reject(err);
          }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error('Resend request timeout'));
    });
    req.write(payload);
    req.end();
  });
}

/**
 * Production-friendly email for Render / cloud hosts.
 * - Prefer Resend (HTTPS): set RESEND_API_KEY and EMAIL_FROM (or use Resend onboarding sender for tests).
 * - Or Gmail SMTP: EMAIL_USER + EMAIL_APP_PASSWORD (16-char Google App Password, not your normal password).
 */
async function sendViaResend({ to, subject, text, html }) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;

  const from =
    process.env.EMAIL_FROM?.trim() ||
    process.env.RESEND_FROM?.trim() ||
    'Wishlink <onboarding@resend.dev>';

  return postJsonResend(
    '/emails',
    { from, to: [to], subject, text, html },
    key
  );
}

function buildSmtpTransport() {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_APP_PASSWORD?.trim();
  if (!emailUser || !emailPass) {
    const err = new Error(
      'Email not configured: set RESEND_API_KEY (recommended) or EMAIL_USER + EMAIL_APP_PASSWORD in Render environment variables.'
    );
    err.code = 'EMAIL_NOT_CONFIGURED';
    throw err;
  }

  const configuredHost = process.env.EMAIL_HOST?.trim();
  const port = Number(process.env.EMAIL_PORT) || 465;
  const secure = process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : port === 465;

  const base = {
    auth: { user: emailUser, pass: emailPass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 45000,
    family: 4,
  };

  if (configuredHost) {
    return nodemailer.createTransport({
      ...base,
      host: configuredHost,
      port,
      secure,
      requireTLS: !secure,
    });
  }

  return nodemailer.createTransport({
    ...base,
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
  });
}

async function sendViaSmtp({ to, subject, text, html }) {
  const transporter = buildSmtpTransport();
  const fromAddr = process.env.EMAIL_USER?.trim();
  await transporter.sendMail({
    from: `"Wishlink Support" <${fromAddr}>`,
    to,
    subject,
    text,
    html,
  });
}

/**
 * @param {{ to: string, subject: string, text: string, html: string }} opts
 */
async function sendTransactionalEmail(opts) {
  const resendResult = await sendViaResend(opts);
  if (resendResult !== null) return resendResult;
  await sendViaSmtp(opts);
}

module.exports = { sendTransactionalEmail };
