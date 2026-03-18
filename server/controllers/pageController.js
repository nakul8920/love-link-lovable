const Page = require('../models/Page');

// @desc    Create or update user page configuration
// @route   POST /api/page
// @access  Private
const createOrUpdatePage = async (req, res) => {
  const { customUrlData, content, images } = req.body;

  try {
    let page = await Page.findOne({ user: req.user._id });

    if (page) {
      // Update existing page
      page.customUrlData = customUrlData || page.customUrlData;
      page.content = content || page.content;
      page.images = images || page.images;

      const updatedPage = await page.save();
      res.json(updatedPage);
    } else {
      // Create new page
      page = new Page({
        user: req.user._id,
        customUrlData,
        content,
        images
      });

      const createdPage = await page.save();
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


module.exports = { createOrUpdatePage, getPageByUrl };
