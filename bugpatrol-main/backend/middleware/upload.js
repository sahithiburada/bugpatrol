const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage }); // Don't call .single() or .array() here

module.exports = upload;
