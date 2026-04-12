const express = require('express');
const router = express.Router();
const { 
  adminLogin, 
  getStats, 
  getUsers, 
  getPages, 
  deletePage, 
  deleteUser 
} = require('../controllers/adminController');
const { listFeedbacks, deleteFeedback } = require('../controllers/feedbackController');
const { adminProtect } = require('../middleware/authMiddleware');

router.post('/login', adminLogin);

// All dashboard endpoints are protected with admin middleware
router.get('/stats', adminProtect, getStats);
router.get('/users', adminProtect, getUsers);
router.get('/pages', adminProtect, getPages);
router.delete('/pages/:id', adminProtect, deletePage);
router.delete('/users/:id', adminProtect, deleteUser);
router.get('/feedback', adminProtect, listFeedbacks);
router.delete('/feedback/:id', adminProtect, deleteFeedback);

module.exports = router;
