const BugReport = require('../models/BugReport');

const submitBug = async (req, res) => {
  try {
    const {
      title,
      website,
      government,
      department,
      bugType,
      description,
      aiDescription,
      tags
    } = req.body;

    // Get user email from session
   
     const userEmail= req.user.email; 
     console.log(userEmail,"token maik");
   
    const fileUrl = req.file?.path || '';

    const newBug = new BugReport({
      title,
      website,
      government,
      department,
      bugType,
      description,
      aiDescription,
      tags: JSON.parse(tags),
      file: fileUrl,
      email: userEmail  // ✅ storing email from session
    });
    console.log(title)
    console.log(userEmail,"email")
    await newBug.save();

    res.status(201).json({ message: 'Bug report submitted', bug: newBug });

  } catch (error) {
    console.error('Bug submit error:', error);
    res.status(500).json({ message: 'Server error submitting bug' });
  }
};

module.exports = { submitBug };
