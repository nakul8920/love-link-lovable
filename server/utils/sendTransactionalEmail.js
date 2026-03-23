const https = require('https');

async function sendTransactionalEmail({ to, subject, text, html }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new Error('RESEND_API_KEY not set in environment variables');

  const payload = JSON.stringify({
    from: process.env.EMAIL_FROM?.trim() || 'onboarding@resend.dev',
    to: [to],
    subject,
    text,
    html,
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data || '{}');
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.message || `Resend failed (${res.statusCode})`));
          }
        } catch (e) {
          reject(new Error('Invalid response from Resend'));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error('Resend timeout')));
    req.write(payload);
    req.end();
  });
}

module.exports = { sendTransactionalEmail };
