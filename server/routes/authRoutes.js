const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, googleAuth, forgotPassword, verifyOtp, resetPassword, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile/password', protect, changePassword);

// New Routes for Google Login and Forgot Password
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

module.exports = router;

