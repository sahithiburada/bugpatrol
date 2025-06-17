const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { submitBug } = require('../controllers/bugController');
const { authenticateToken } = require('../middleware/authmiddleware');  // import your auth middleware

router.post('/submit', authenticateToken, upload.single('file'), submitBug);

module.exports = router;
