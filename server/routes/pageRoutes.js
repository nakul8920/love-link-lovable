const express = require('express');
const router = express.Router();
const { createOrUpdatePage, getPageByUrl, getUserPages } = require('../controllers/pageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrUpdatePage);
router.route('/user').get(protect, getUserPages);
router.route('/:customUrlData').get(getPageByUrl);

module.exports = router;
