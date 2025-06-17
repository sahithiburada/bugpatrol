const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getUserStats,
  updateUserProfile,
  getUserNotifications
} = require('../controllers/profileController');

// Test route to verify the routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Profile routes are working!' });
});

// Get user profile data
router.get('/:email', getUserProfile);

// Get user statistics
router.get('/stats/:email', getUserStats);

// Update user profile
router.put('/:email', updateUserProfile);

// Get user notifications
router.get('/notifications/:email', getUserNotifications);

module.exports = router;