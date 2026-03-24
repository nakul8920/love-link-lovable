const https = require('https');

async function sendTransactionalEmail({ to, subject, text, html }) {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) throw new Error('BREVO_API_KEY not set');

  const payload = JSON.stringify({
    sender: { name: 'Wishlink Support', email: 'nakuljangid99@gmail.com' },
    to: [{ email: to }],
    subject,
    textContent: text,
    htmlContent: html,
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'api-key': apiKey,
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
            reject(new Error(parsed.message || `Brevo failed (${res.statusCode})`));
          }
        } catch (e) {
          reject(new Error('Invalid response from Brevo'));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error('Brevo timeout')));
    req.write(payload);
    req.end();
  });
}

module.exports = { sendTransactionalEmail };