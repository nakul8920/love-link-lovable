const User = require('../models/User');
const Page = require('../models/Page');
const { generateAdminToken } = require('../utils/generateToken');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = (req, res) => {
  const { username, password } = req.body;

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  // Debug logging (remove in production)
  console.log('Admin login attempt:', { username, validUsername: !!validUsername, validPassword: !!validPassword });

  if (!validUsername || !validPassword) {
    return res.status(500).json({ message: 'Admin credentials not configured on server' });
  }

  if (username === validUsername && password === validPassword) {
    res.json({
      success: true,
      message: 'Login successful',
      username: validUsername,
      token: generateAdminToken(),
    });
  } else {
    res.status(401).json({ 
      success: false,
      message: 'Invalid admin credentials' 
    });
  }
};

// @desc    Get complete admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalPages = await Page.countDocuments({});
    
    // Revenue estimation logic based on total pages * 49 INR
    const totalRevenue = totalPages * 49;

    res.json({
      totalUsers,
      totalPages,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (with pages mapped)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    // We want users and maybe aggregate their pages
    const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();
    
    // Add page count to users
    for (let u of users) {
      const pageCount = await Page.countDocuments({ user: u._id });
      u.pageCount = pageCount;
    }
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pages with user details
// @route   GET /api/admin/pages
// @access  Private/Admin
const getPages = async (req, res) => {
  try {
    const pages = await Page.find({}).populate('user', 'username email').sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete page
// @route   DELETE /api/admin/pages/:id
// @access  Private/Admin
const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    await page.deleteOne();
    res.json({ message: 'Page removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user and their pages
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await Page.deleteMany({ user: user._id });
    await user.deleteOne();
    res.json({ message: 'User and their pages removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  adminLogin,
  getStats,
  getUsers,
  getPages,
  deletePage,
  deleteUser,
};
