const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables before importing routes/controllers that read process.env at module load.
dotenv.config({ path: path.join(__dirname, '.env') });

// Route files
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const pageRoutes = require('./routes/pageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const supportRoutes = require('./routes/supportRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');


// Connect to database
// NOTE: Application will crash if MONGO_URI is invalid when connection is attempted.
connectDB();

const app = express();

const parseOriginList = (value) =>
  (value || '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);

const defaultAllowedOrigins = [
  'https://love-link-lovable.vercel.app',
  'https://love-link-creator.vercel.app',
  'https://love-link-lovable-production.up.railway.app',
  'https://love-link-lovable.up.railway.app',
  'https://wishlink-express.up.railway.app',
  'http://localhost:5173',
  'http://localhost:8080',
];

const extraFromEnv = [
  ...parseOriginList(process.env.ALLOWED_ORIGINS),
  ...parseOriginList(process.env.FRONTEND_URL),
  ...parseOriginList(process.env.CLIENT_URL),
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
];

const allowedOrigins = new Set([...defaultAllowedOrigins, ...extraFromEnv]);
const corsAllowAny = process.env.CORS_ALLOW_ANY === 'true' || process.env.CORS_ALLOW_ANY === '1';

// Middleware — add your live site URL via FRONTEND_URL or ALLOWED_ORIGINS on the server (comma-separated).
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (corsAllowAny || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      console.warn(
        `[CORS] Blocked origin: ${origin}. Set FRONTEND_URL or ALLOWED_ORIGINS (or CORS_ALLOW_ANY=true for testing only).`
      );
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// COOP header bhi add kar (Google Login fix)
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

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
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/feedback', feedbackRoutes);

const PORT = process.env.PORT || 5000;

// Bind 0.0.0.0 so Railway / Docker can route to the container (not just localhost).
app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});
