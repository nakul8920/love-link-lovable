const Feedback = require('../models/Feedback');

const MAX_IMAGES = 6;
const MAX_MESSAGE = 8000;

function isAllowedImageUrl(s) {
  if (typeof s !== 'string' || !s.trim()) return false;
  const v = s.trim();
  if (v.length > 512) return false;
  if (v.startsWith('/uploads/')) return true;
  if (/^https?:\/\//i.test(v)) return true;
  return false;
}

// @route   POST /api/feedback
// @access  Public (optional user if Bearer token)
const submitFeedback = async (req, res) => {
  try {
    const { message, images, name, email } = req.body || {};

    const text = typeof message === 'string' ? message.trim() : '';
    if (!text) {
      return res.status(400).json({ message: 'Please write your feedback.' });
    }
    if (text.length > MAX_MESSAGE) {
      return res.status(400).json({ message: `Feedback is too long (max ${MAX_MESSAGE} characters).` });
    }

    const rawImages = Array.isArray(images) ? images : [];
    if (rawImages.length > MAX_IMAGES) {
      return res.status(400).json({ message: `You can attach at most ${MAX_IMAGES} images.` });
    }

    const cleanedImages = [];
    for (const item of rawImages) {
      if (typeof item !== 'string') continue;
      if (!isAllowedImageUrl(item)) {
        return res.status(400).json({ message: 'Invalid image URL.' });
      }
      cleanedImages.push(item.trim());
    }

    const nameStr = typeof name === 'string' ? name.trim().slice(0, 120) : '';
    const emailStr = typeof email === 'string' ? email.trim().slice(0, 200) : '';

    const doc = await Feedback.create({
      message: text,
      images: cleanedImages,
      name: nameStr,
      email: emailStr,
      user: req.user?._id || null,
    });

    res.status(201).json({
      message: 'Thank you! Your feedback was submitted.',
      id: doc._id,
    });
  } catch (error) {
    console.error('submitFeedback:', error);
    res.status(500).json({ message: error.message || 'Could not save feedback.' });
  }
};

// @route   GET /api/admin/feedback
// @access  Admin
const listFeedbacks = async (req, res) => {
  try {
    const items = await Feedback.find({})
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/admin/feedback/:id
// @access  Admin
const deleteFeedback = async (req, res) => {
  try {
    const row = await Feedback.findById(req.params.id);
    if (!row) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    await row.deleteOne();
    res.json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitFeedback,
  listFeedbacks,
  deleteFeedback,
};
