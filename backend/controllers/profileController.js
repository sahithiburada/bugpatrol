const User = require('../models/User');
const Authority = require('../models/Authority');
const BugReport = require('../models/BugReport');
const bcrypt = require('bcrypt');

// Get user profile data
const getUserProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const { role } = req.query;

    console.log(`Fetching profile for email: ${email}, role: ${role}`);

    let user;
    if (role === 'citizen') {
      user = await User.findOne({ email }).select('-password');
    } else if (role === 'authority') {
      user = await Authority.findOne({ email }).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`Fetching stats for email: ${email}`);

    // Count total reports filed by user
    const reportsCount = await BugReport.countDocuments({ email });
    
    // Count resolved issues (status is 'closed' or 'resolved')
    const resolvedCount = await BugReport.countDocuments({ 
      email, 
      status: { $in: ['closed', 'resolved'] } 
    });

    console.log(`Stats - Reports: ${reportsCount}, Resolved: ${resolvedCount}`);

    res.json({
      reportsCount,
      resolvedCount
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    
   const { email } = req.params;
   
  const { role, ...updateData } = req.body;

    // Validate that updateData is an object


    console.log(`Updating profile for email: ${email}, role: ${role}`, updateData);

    // If password is being updated, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    let updatedUser;
    if (role === 'citizen') {
      updatedUser = await User.findOneAndUpdate(
  { email },
  { $set: updateData },
  { new: true, runValidators: true }
).select('-password');

    } else if (role === 'authority') {
      updatedUser = await Authority.findOneAndUpdate(
        { email },
        updateData,
        { new: true, runValidators: true }
      ).select('-password');
    }

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile updated successfully');
    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`Fetching notifications for email: ${email}`);

    // Get recent reports and their status changes
    const recentReports = await BugReport.find({ email })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title status createdAt');

    const notifications = recentReports.map(report => ({
      id: report._id,
      message: report.status === 'resolved' || report.status === 'closed' 
        ? `Your report "${report.title}" has been resolved`
        : `You reported "${report.title}"`,
      time: getTimeAgo(report.createdAt),
      type: report.status === 'resolved' || report.status === 'closed' ? 'resolved' : 'report'
    }));

    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to format time
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 60) {
    return `${diffInMins}mins ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays}day${diffInDays > 1 ? 's' : ''} ago`;
  }
};

module.exports = {
  getUserProfile,
  getUserStats,
  updateUserProfile,
  getUserNotifications
};