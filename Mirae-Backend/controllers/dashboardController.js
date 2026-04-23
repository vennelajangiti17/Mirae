const Job = require('../models/Job');

const getDashboardSummary = async (req, res) => {
  try {
    console.log('[Dashboard API] Summary requested for userId:', req.user.id);
    const [
      totalJobs,
      saved,
      applied,
      interviewing,
      offers,
      rejected,
    ] = await Promise.all([
      Job.countDocuments({ userId: req.user.id }),
      Job.countDocuments({ userId: req.user.id, status: 'Saved' }),
      Job.countDocuments({ userId: req.user.id, status: 'Applied' }),
      Job.countDocuments({ userId: req.user.id, status: 'Interviewing' }),
      Job.countDocuments({ userId: req.user.id, status: 'Offer' }),
      Job.countDocuments({ userId: req.user.id, status: 'Rejected' }),
    ]);

    console.log('[Dashboard API] Summary result:', { totalJobs, saved, applied, interviewing, offers, rejected });

    res.status(200).json({
      totalJobs,
      saved,
      applied,
      interviewing,
      offers,
      rejected,
    });
  } catch (error) {
    console.error('[Dashboard API] Summary error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
};

const getRecentJobs = async (req, res) => {
  try {
    const recentJobs = await Job.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select(
        'company title status category url description matchScore matchedSkills missingSkills salaryRange location appliedDate createdAt'
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
