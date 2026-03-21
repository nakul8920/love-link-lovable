const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizeEmail = (email) => email.trim().toLowerCase();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isGoogleEmail = email.toLowerCase().endsWith('@gmail.com') || email.toLowerCase().endsWith('@googlemail.com');
    if (!isGoogleEmail) {
      return res.status(400).json({ message: 'Please use a real Google email address (@gmail.com)' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Auto-generate username from email
    const username = email.split('@')[0].toLowerCase() + Math.floor(Math.random() * 10000);

    // Hash password before saving
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist with this email address' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'This account does not have a password. Please login with Google.' });
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

// @desc    Forgot Password (Send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const normalizedEmail = normalizeEmail(email);
    // Case-insensitive email match (real-world: users may type different casing/spaces)
    const user = await User.findOne({
      email: { $regex: `^${escapeRegExp(normalizedEmail)}$`, $options: 'i' },
    });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString(); // 6 digits
    const otpHash = sha256(otp);
    
    // Valid for 10 minutes
    user.resetPasswordOtp = otpHash;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();

    // Send email
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_APP_PASSWORD;
    const missing = [];
    if (!emailUser) missing.push('EMAIL_USER');
    if (!emailPass) missing.push('EMAIL_APP_PASSWORD');
    if (missing.length) {
      throw new Error(
        `Missing ${missing.join(', ')} on server. Set these in your hosting environment variables (Render dashboard).`
      );
    }

    const configuredHost = process.env.EMAIL_HOST?.trim();
    const port = Number(process.env.EMAIL_PORT) || 465;
    const secure = process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : port === 465;
    const transportConfig = configuredHost
      ? {
          host: configuredHost,
          port,
          secure,
          auth: { user: emailUser, pass: emailPass },
          requireTLS: !secure,
        }
      : {
          // Gmail service mode is more reliable on platforms like Render
          // when host/port are not explicitly configured.
          service: 'gmail',
          auth: { user: emailUser, pass: emailPass },
        };

    const transporter = nodemailer.createTransport({
      ...transportConfig,
      // Prevent SMTP calls from hanging forever on production platforms.
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });

    // Some SMTP providers can fail `verify()` even when `sendMail()` would work.
    // So verify ko "warn + continue" mode me rakha hai.
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.warn('SMTP verify failed (continuing):', {
        message: verifyError?.message,
        code: verifyError?.code,
        responseCode: verifyError?.responseCode,
      });
    }

    const mailOptions = {
      from: `"Wishlink Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your Wishlink Password Reset Code',
      text: `Your Wishlink password reset OTP is: ${otp}. This code is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #4F46E5; text-align: center;">Wishlink Magic</h2>
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">We received a request to reset your password. Use the OTP code below to securely change your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; padding: 10px 20px; background-color: #4F46E5; color: #fff; border-radius: 8px; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #666; text-align: center;">This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 12px; color: #aaa; text-align: center;">Wishlink Support Team<br>Keeping your digital envelopes safe.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent to email successfully' });
  } catch (error) {
    // Nodemailer errors sometimes don't stringify well; log the useful fields.
    const message =
      error instanceof Error
        ? error.message
        : error?.message || error?.toString?.() || 'Failed to send OTP';
    console.error('Error sending OTP:', {
      message,
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command,
      stack: error?.stack,
    });

    res.status(500).json({
      message,
      code: error?.code,
      responseCode: error?.responseCode,
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const normalizedEmail = normalizeEmail(email);
    const otpHash = sha256(String(otp).trim());

    const user = await User.findOne({ 
      email: { $regex: `^${escapeRegExp(normalizedEmail)}$`, $options: 'i' },
      resetPasswordOtp: otpHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const normalizedEmail = normalizeEmail(email);
    const otpHash = sha256(String(otp).trim());

    const user = await User.findOne({ 
      email: { $regex: `^${escapeRegExp(normalizedEmail)}$`, $options: 'i' },
      resetPasswordOtp: otpHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Reset password
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change Password
// @route   PUT /api/auth/profile/password
// @access  Private
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user has an existing password, verify it first
    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }
      if (!(await user.matchPassword(currentPassword))) {
        return res.status(401).json({ message: 'Invalid current password' });
      }
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, authUser, getUserProfile, googleAuth, forgotPassword, verifyOtp, resetPassword, changePassword };
