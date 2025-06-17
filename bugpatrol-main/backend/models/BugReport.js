const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  website: { type: String, required: true },
  government: { type: String, required: true },
  department: { type: String, required: true },
  bugType: { type: String, required: true },
  description: { type: String, required: true },
  aiDescription: { type: String },
  tags: { type: [String], default: [] }, // Array of tags
  file: { type: String }, // Store only one image URL
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  email: { type: String, required: true },
});

const BugReport = mongoose.model('BugReport', issueSchema);

module.exports = BugReport;
