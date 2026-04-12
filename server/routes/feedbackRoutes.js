const express = require('express');
const router = express.Router();
const { submitFeedback } = require('../controllers/feedbackController');
const { optionalUser } = require('../middleware/authMiddleware');

router.post('/', optionalUser, submitFeedback);

module.exports = router;
