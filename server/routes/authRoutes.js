const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, googleAuth } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

// Route for Google Login
router.post('/google', googleAuth);

module.exports = router;

