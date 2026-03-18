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
dotenv.config();

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

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
