const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const pageRoutes = require('./routes/pageRoutes');

// Load environment variables
// Important: use an explicit path so production start command from repo root works.
dotenv.config({ path: path.join(__dirname, '.env') });

// Render / production use process.env from the dashboard; .env is usually not uploaded (gitignored).
const _resend = Boolean(process.env.RESEND_API_KEY?.trim());
const _smtp = Boolean(
  process.env.EMAIL_USER?.trim() && process.env.EMAIL_APP_PASSWORD?.trim()
);
if (_resend) {
  console.log('[email] Resend enabled (RESEND_API_KEY set) — forgot-password uses Resend first.');
} else if (_smtp) {
  console.log('[email] Gmail SMTP enabled (EMAIL_USER + EMAIL_APP_PASSWORD).');
} else {
  console.warn(
    '[email] No email env detected on this process. Add EMAIL_USER + EMAIL_APP_PASSWORD (or RESEND_API_KEY) in your host’s Environment tab — local server/.env is not deployed to Render.'
  );
}

// Connect to database
// NOTE: Application will crash if MONGO_URI is invalid when connection is attempted.
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Make uploads folder static
const fs = require('fs');
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes); // Use as: /api/upload (POST)
app.use('/api/page', pageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
