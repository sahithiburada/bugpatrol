const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const authoritySchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  dateOfBirth: String,
  department: String,
  governmentId: String,
  position: String,
  password: String
});

authoritySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Authority', authoritySchema);
