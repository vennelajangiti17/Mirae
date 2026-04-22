const Job = require('../models/Job');

const getAnalyticsOverview = async (req, res) => {
  try {
    const jobs = await Job.find().select(
      'status matchScore matchedSkills missingSkills company title createdAt'
    );

    const totalJobs = jobs.length;
    const offers = jobs.filter((job) => job.status === 'Offer').length;
    const rejected = jobs.filter((job) => job.status === 'Rejected').length;
    const interviewing = jobs.filter((job) => job.status === 'Interviewing').length;
    const applied = jobs.filter((job) => job.status === 'Applied').length;
    const saved = jobs.filter((job) => job.status === 'Saved').length;

    const avgMatchScore =
      totalJobs > 0
        ? Math.round(
            jobs.reduce((sum, job) => sum + (job.matchScore || 0), 0) / totalJobs
          )
        : 0;

    const skillCounts = {};
    jobs.forEach((job) => {
      (job.matchedSkills || []).forEach((skill) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.status(200).json({
      totalJobs,
      saved,
      applied,
      interviewing,
      offers,
      rejected,
      avgMatchScore,
      topSkills,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics overview' });
  }
};

const getStatusBreakdown = async (req, res) => {
  try {
    const breakdown = await Job.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ]);

    res.status(200).json(breakdown);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status breakdown' });
  }
};

const getTrends = async (req, res) => {
  try {
    const trends = await Job.aggregate([
      {
        $match: {
          createdAt: { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: [
                  { $lt: ['$_id.month', 10] },
                  { $concat: ['0', { $toString: '$_id.month' }] },
                  { $toString: '$_id.month' },
                ],
              },
              '-',
              {
                $cond: [
                  { $lt: ['$_id.day', 10] },
                  { $concat: ['0', { $toString: '$_id.day' }] },
                  { $toString: '$_id.day' },
                ],
              },
            ],
          },
          count: 1,
        },
      },
    ]);

    res.status(200).json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
};

module.exports = {
  getAnalyticsOverview,
  getStatusBreakdown,
  getTrends,
};
