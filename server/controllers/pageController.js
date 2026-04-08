const Page = require('../models/Page');
const PaymentVerification = require('../models/PaymentVerification');

// @desc    Create or update user page configuration
// @route   POST /api/page
// @access  Private
const createOrUpdatePage = async (req, res) => {
  const { customUrlData, content, images } = req.body;

  try {
    let page = await Page.findOne({ customUrlData });

    if (page) {
      if (page.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to edit this page' });
      }
      
      // Update existing page
      page.content = content || page.content;
      page.images = images || page.images;

      const updatedPage = await page.save();
      res.json(updatedPage);
    } else {
      const orderId = content?.orderId;

      if (!orderId) {
        return res.status(400).json({ message: 'Payment is required before creating a link.' });
      }

      const verifiedPayment = await PaymentVerification.findOne({
        user: req.user._id,
        orderId,
        verified: true,
        consumed: false,
      });

      if (!verifiedPayment) {
        return res.status(402).json({ message: 'Valid payment not found. Please complete payment first.' });
      }

      // Create new page
      page = new Page({
        user: req.user._id,
        customUrlData,
        content,
        images
      });

      const createdPage = await page.save();
      verifiedPayment.consumed = true;
      await verifiedPayment.save();
      res.status(201).json(createdPage);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user page configuration by custom URL
// @route   GET /api/page/:customUrlData
// @access  Public
const getPageByUrl = async (req, res) => {
  try {
    const page = await Page.findOne({ customUrlData: req.params.customUrlData }).populate('user', 'username');

    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pages for logged in user
// @route   GET /api/page/user
// @access  Private
const getUserPages = async (req, res) => {
  try {
    const pages = await Page.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrUpdatePage, getPageByUrl, getUserPages };
