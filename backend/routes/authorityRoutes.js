// routes/authorityRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAuthorityDashboard, 
  updateBugStatus, 
  getBugDetails 
} = require('../controllers/dashboardcontrollers');

// Middleware to check if user is authenticated and is an authority
const authenticateAuthority = (req, res, next) => {
  if ( req.session.user.role !== 'authority') {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
  next();
};

// Get dashboard data
router.get('/dashboard', authenticateAuthority, getAuthorityDashboard);

// Update bug status
router.put('/bug/status', authenticateAuthority, updateBugStatus);

// Get bug details
router.get('/bug/:bugId', authenticateAuthority, getBugDetails);

module.exports = router;