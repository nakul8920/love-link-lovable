const express = require('express');
const router = express.Router();
const { getUserProfile, googleAuth, registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
router.get('/profile', protect, getUserProfile);

// Route for Google Login
router.post('/google', googleAuth);

// Route for Register
router.post('/register', registerUser);

// Route for Login
router.post('/login', loginUser);

module.exports = router;

