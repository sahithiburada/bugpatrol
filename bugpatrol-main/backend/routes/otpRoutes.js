const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../controllers/otpController');

// Endpoint to request an OTP
router.post('/send-otp', sendOtp);

// Endpoint to verify an OTP
router.post('/verify-otp', verifyOtp);

module.exports = router;