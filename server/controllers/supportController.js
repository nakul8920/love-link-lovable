const nodemailer = require('nodemailer');

const ISSUE_LABELS = {
  page_create: "Page won't create / save error",
  payment_no_link: "Paid but didn't get my link",
  link_broken: "Link doesn't open or is broken",
  other: 'Other (see message below)',
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Gmail app passwords are 16 chars; Google often shows them with spaces — strip those. */
function normalizeSmtpUser(raw) {
  if (!raw) return '';
  let u = String(raw).trim();
  if (
    (u.startsWith('"') && u.endsWith('"')) ||
    (u.startsWith("'") && u.endsWith("'"))
  ) {
    u = u.slice(1, -1).trim();
  }
  return u;
}

function normalizeSmtpPass(raw) {
  if (!raw) return '';
  let p = String(raw).trim();
  if (
    (p.startsWith('"') && p.endsWith('"')) ||
    (p.startsWith("'") && p.endsWith("'"))
  ) {
    p = p.slice(1, -1).trim();
  }
  return p.replace(/\s+/g, '');
}

function buildTransporter() {
  const user = normalizeSmtpUser(process.env.SMTP_USER || process.env.EMAIL_USER);
  const pass = normalizeSmtpPass(process.env.SMTP_PASS || process.env.EMAIL_APP_PASSWORD);
  if (!user || !pass) return null;

  const host = process.env.SMTP_HOST;
  if (host) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    });
  }

  // Explicit Gmail SMTP (avoids some "service: gmail" quirks; works with App Passwords)
  if ((process.env.SMTP_SERVICE || 'gmail').toLowerCase() === 'gmail') {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: { user, pass },
  });
}

function clientMessageForMailError(error) {
  const raw = `${error?.message || ''} ${error?.response || ''}`;
  const code = error?.responseCode;
  const authFail =
    code === 535 ||
    /535|Invalid login|BadCredentials|authentication failed|Username and Password not accepted/i.test(
      raw
    );

  if (authFail) {
    return {
      status: 502,
      message:
        "We couldn't deliver your request right now. Please try again in a little while.",
      adminLog:
        'Gmail SMTP rejected login (535). Easiest fix: set RESEND_API_KEY (+ SUPPORT_INBOX_EMAIL) in server .env — see Resend.com. Or fix Gmail with a real App Password (2FA on) and full email as EMAIL_USER.',
    };
  }

  return {
    status: 502,
    message: "We couldn't deliver your request right now. Please try again later.",
    adminLog: raw.slice(0, 200),
  };
}

/**
 * Resend HTTP API — no Gmail SMTP. Free tier: get API key at resend.com
 * Env: RESEND_API_KEY (required), RESEND_FROM (optional, default onboarding@resend.dev),
 *      SUPPORT_INBOX_EMAIL = where tickets are delivered
 */
async function sendViaResend({ to, subject, text, html, replyTo }) {
  const key = (process.env.RESEND_API_KEY || '').trim();
  if (!key) {
    throw new Error('RESEND_API_KEY not set');
  }

  const from =
    (process.env.RESEND_FROM || '').trim() ||
    'Wishlink Support <onboarding@resend.dev>';

  const payload = {
    from,
    to: [to],
    subject,
    text,
    html,
  };
  if (replyTo) {
    payload.reply_to = replyTo;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data?.message || JSON.stringify(data) || res.statusText;
    const err = new Error(`Resend ${res.status}: ${detail}`);
    err.resendBody = data;
    throw err;
  }
  return data;
}

// @route   POST /api/support
// @access  Public
const submitSupport = async (req, res) => {
  try {
    const { username, phone, issues, customMessage, contactEmail } = req.body || {};

    const name = typeof username === 'string' ? username.trim() : '';
    const phoneStr = typeof phone === 'string' ? phone.trim() : '';
    const extra = typeof customMessage === 'string' ? customMessage.trim() : '';
    const emailStr =
      typeof contactEmail === 'string' && contactEmail.trim() ? contactEmail.trim() : '';

    if (!name) {
      return res.status(400).json({ message: 'Username is required.' });
    }
    if (!phoneStr || phoneStr.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ message: 'Please enter a valid phone number (at least 10 digits).' });
    }

    const allowed = new Set(Object.keys(ISSUE_LABELS));
    const rawIssues = Array.isArray(issues) ? issues : [];
    const selected = [...new Set(rawIssues.filter((k) => allowed.has(k)))];

    if (selected.length === 0 && !extra) {
      return res.status(400).json({
        message: 'Select at least one issue or write a message.',
      });
    }
    if (selected.length === 1 && selected[0] === 'other' && !extra) {
      return res.status(400).json({
        message: 'Please describe your issue when you select Other.',
      });
    }

    const inbox = normalizeSmtpUser(
      process.env.SUPPORT_INBOX_EMAIL ||
        process.env.SUPPORT_EMAIL ||
        process.env.SMTP_USER ||
        process.env.EMAIL_USER ||
        ''
    );

    if (!inbox) {
      console.error('Support mail: set SUPPORT_INBOX_EMAIL (or RESEND + inbox email)');
      return res.status(503).json({
        message:
          'Support email is not configured yet. Please try again later or email us directly.',
      });
    }

    const issueLines = selected.map((k) => `• ${ISSUE_LABELS[k]}`).join('\n');
    const text = [
      'New Wishlink support request',
      '',
      `Username: ${name}`,
      `Phone: ${phoneStr}`,
      emailStr ? `Contact email: ${emailStr}` : null,
      '',
      'Selected issues:',
      selected.length ? issueLines : '(none — details in message only)',
      '',
      'Message:',
      extra || '(none)',
    ]
      .filter(Boolean)
      .join('\n');

    const html = `
      <h2 style="font-family:system-ui,sans-serif">Wishlink support</h2>
      <p style="font-family:system-ui,sans-serif"><strong>Username:</strong> ${escapeHtml(name)}</p>
      <p style="font-family:system-ui,sans-serif"><strong>Phone:</strong> ${escapeHtml(phoneStr)}</p>
      ${
        emailStr
          ? `<p style="font-family:system-ui,sans-serif"><strong>Email:</strong> ${escapeHtml(
              emailStr
            )}</p>`
          : ''
      }
      <p style="font-family:system-ui,sans-serif"><strong>Issues:</strong></p>
      ${
        selected.length
          ? `<ul style="font-family:system-ui,sans-serif">${selected
              .map((k) => `<li>${escapeHtml(ISSUE_LABELS[k])}</li>`)
              .join('')}</ul>`
          : '<p style="font-family:system-ui,sans-serif"><em>None selected — message only</em></p>'
      }
      <p style="font-family:system-ui,sans-serif"><strong>Message:</strong></p>
      <pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(extra)}</pre>
    `;

    const subject = `[Wishlink] ${name} · ${phoneStr}`;
    const replyTo = emailStr || undefined;

    const resendKey = (process.env.RESEND_API_KEY || '').trim();
    if (resendKey) {
      try {
        await sendViaResend({
          to: inbox,
          subject,
          text,
          html,
          replyTo,
        });
        return res.status(200).json({ message: 'Sent' });
      } catch (resendErr) {
        console.error('Support Resend error:', resendErr);
        return res.status(502).json({
          message:
            "We couldn't deliver your request right now. Please try again in a little while.",
        });
      }
    }

    const transporter = buildTransporter();
    if (!transporter) {
      console.error(
        'Support mail: no RESEND_API_KEY and no SMTP (EMAIL_USER + EMAIL_APP_PASSWORD)'
      );
      return res.status(503).json({
        message:
          'Support email is not configured yet. Please try again later or email us directly.',
      });
    }

    const smtpUser = normalizeSmtpUser(process.env.SMTP_USER || process.env.EMAIL_USER);
    const fromAddr = normalizeSmtpUser(process.env.SMTP_FROM) || smtpUser;

    await transporter.sendMail({
      from: `"Wishlink Support" <${fromAddr}>`,
      to: inbox,
      replyTo,
      subject,
      text,
      html,
    });

    res.status(200).json({ message: 'Sent' });
  } catch (error) {
    const { status, message, adminLog } = clientMessageForMailError(error);
    console.error('Support submit error:', error);
    if (adminLog) console.error('[support] Fix SMTP on server:', adminLog);
    res.status(status).json({ message });
  }
};

module.exports = { submitSupport };
