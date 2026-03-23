async function run() {
  try {
    const res = await fetch('https://love-link-lovable.onrender.com/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nakuljangid99@gmail.com' })
    });
    console.log(`STATUS: ${res.status}`);
    const text = await res.text();
    console.log(`BODY: ${text}`);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
run();
