const crypto = require('crypto');
const transporter = require('../config/emailConfig');

// Simple in-memory store; replace with Redis/DB in production
const otpStore = new Map();

function generateOTP() {
  // 6-digit numeric OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email) {
  const otp = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000; // valid for 10 minutes
  otpStore.set(email, { code: otp, expires: expiresAt });

  // Send the OTP via email
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`
  });

  return otp;
}

function verifyOTP(email, code) {
  const record = otpStore.get(email);
  if (!record) return false;
  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return false;
  }
  const isValid = record.code === code;
  if (isValid) otpStore.delete(email);
  return isValid;
}

module.exports = { sendOTP, verifyOTP };