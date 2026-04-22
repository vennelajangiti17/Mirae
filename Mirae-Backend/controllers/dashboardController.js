const Job = require('../models/Job');

const getDashboardSummary = async (req, res) => {
  try {
    const [
      totalJobs,
      saved,
      applied,
      interviewing,
      offers,
      rejected,
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'Saved' }),
      Job.countDocuments({ status: 'Applied' }),
      Job.countDocuments({ status: 'Interviewing' }),
      Job.countDocuments({ status: 'Offer' }),
      Job.countDocuments({ status: 'Rejected' }),
    ]);

    res.status(200).json({
      totalJobs,
      saved,
      applied,
      interviewing,
      offers,
      rejected,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
};

const getRecentJobs = async (req, res) => {
  try {
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select(
        'company title status url matchScore matchedSkills missingSkills salaryRange location appliedDate createdAt'
      );

    res.status(200).json(recentJobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent jobs' });
  }
};

module.exports = {
  getDashboardSummary,
  getRecentJobs,
};
