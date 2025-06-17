const nodemailer = require('nodemailer');

// Configure transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sahusubham1975@gmail.com',
    pass: 'czni segm dctv qsly'  // ← paste app password here without spaces
  }
});


module.exports = transporter;