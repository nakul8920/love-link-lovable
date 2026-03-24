const express = require('express');
const router = express.Router();
const { getUserProfile, googleAuth } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
router.get('/profile', protect, getUserProfile);

// Route for Google Login
router.post('/google', googleAuth);

module.exports = router;

