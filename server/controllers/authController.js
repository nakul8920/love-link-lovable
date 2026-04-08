const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');


// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth with Google
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  const { credential } = req.body;
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;
    
    let user = await User.findOne({ email });
    if (!user) {
      // Create user if not exists
      const baseName = name ? name.replace(/\s+/g, '').toLowerCase() : email.split('@')[0].toLowerCase();
      user = await User.create({
        username: baseName + Math.floor(Math.random() * 10000),
        email,
      });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Google Authentication failed', error: error.message });
  }
};

module.exports = { getUserProfile, googleAuth };
