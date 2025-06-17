// controllers/authorityDashboardController.js
const BugReport = require('../models/BugReport');
const Authority = require('../models/Authority');

// Get Authority Dashboard Data
const getAuthorityDashboard = async (req, res) => {
  try {
    const authorityId = req.session.user.id;
    console.log(req.session.user.id, "session user id");
    console.log(authorityId, "authorityId");
    // Get authority details
    const authority = await Authority.findById(authorityId);
    if (!authority) {
      return res.status(404).json({ message: 'Authority not found' });
    }

    const authorityDepartment = authority.department;

    // Get total reports for this department
    const totalReports = await BugReport.countDocuments({ 
      department: authorityDepartment 
    });

    // Get new bugs (status: 'active')
    const newBugs = await BugReport.countDocuments({ 
      department: authorityDepartment,
      status: 'active'
    });

    // Get in progress bugs
    const inProgress = await BugReport.countDocuments({ 
      department: authorityDepartment,
      status: 'in progress'
    });

    // Get resolved bugs (status: 'closed')
    const resolved = await BugReport.countDocuments({ 
      department: authorityDepartment,
      status: 'closed'
    });

    // Get latest 10 bug reports for this department
    const latestBugs = await BugReport.find({ 
      department: authorityDepartment 
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('title description status bugType createdAt email');

    // Calculate success rate (resolved / total * 100)
    const successRate = totalReports > 0 ? Math.round((resolved / totalReports) * 100) : 0;

    // Dashboard statistics
    const dashboardData = {
      authority: {
        name: authority.name,
        department: authority.department,
        position: authority.position
      },
      stats: {
        totalReports,
        newBugs,
        inProgress,
        resolved,
        successRate
      },
      latestBugs: latestBugs.map(bug => ({
        id: bug._id,
        title: bug.title,
        description: bug.description,
        status: bug.status,
        priority: bug.bugType, // Using bugType as priority
        reportedDate: bug.createdAt.toISOString().split('T')[0], // Format: YYYY-MM-DD
        email: bug.email
      })),
      myPanel: {
        assignedToMe: 12, // Static value as requested
        avgResolutionTime: '2.5 days', // Static value
        resolvedThisMonth: 45, // Static value
        successRate: '94%' // Static value
      }
    };

    res.status(200).json(dashboardData);

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dashboard data', 
      error: error.message 
    });
  }
};

// Update Bug Status
const updateBugStatus = async (req, res) => {
  try {
    const { bugId, status } = req.body;
    const authorityId = req.session.user.id;
    
    // Get authority details
    const authority = await Authority.findById(authorityId);
    if (!authority) {
      return res.status(404).json({ message: 'Authority not found' });
    }
 console.log("update called");
    // Find and update bug report
    const bugReport = await BugReport.findOneAndUpdate(
      { 
        _id: bugId, 
        department: authority.department 
      },
      { status },
      { new: true }
    );

    if (!bugReport) {
      return res.status(404).json({ message: 'Bug report not found or not authorized' });
    }

    res.status(200).json({ 
      message: 'Bug status updated successfully', 
      bugReport 
    });

  } catch (error) {
    console.error('Update bug status error:', error);
    res.status(500).json({ 
      message: 'Failed to update bug status', 
      error: error.message 
    });
  }
};

// Get Bug Details
const getBugDetails = async (req, res) => {
  try {
    const { bugId } = req.params;
    const authorityId = req.session.user.id;
    
    // Get authority details
    const authority = await Authority.findById(authorityId);
    if (!authority) {
      return res.status(404).json({ message: 'Authority not found' });
    }

    // Find bug report
    const bugReport = await BugReport.findOne({
      _id: bugId,
      department: authority.department
    });

    if (!bugReport) {
      return res.status(404).json({ message: 'Bug report not found or not authorized' });
    }

    res.status(200).json(bugReport);

  } catch (error) {
    console.error('Get bug details error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch bug details', 
      error: error.message 
    });
  }
};

module.exports = {
  getAuthorityDashboard,
  updateBugStatus,
  getBugDetails
};