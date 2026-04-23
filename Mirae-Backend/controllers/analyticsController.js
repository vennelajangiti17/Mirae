const Job = require('../models/Job');
const mongoose = require('mongoose');

const getAnalyticsOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await Job.find({ userId }).select(
      'status matchScore skills matchedSkills missingSkills company title createdAt'
    );

    const totalJobs = jobs.length;
    const offers = jobs.filter((job) => job.status === 'Offer').length;
    const rejected = jobs.filter((job) => job.status === 'Rejected').length;
    const interviewing = jobs.filter((job) => job.status === 'Interviewing').length;
    const applied = jobs.filter((job) => job.status === 'Applied').length;
    const saved = jobs.filter((job) => job.status === 'Saved').length;

    // Only average jobs that actually have a match score (not null)
    const scoredJobs = jobs.filter((job) => job.matchScore !== null && job.matchScore !== undefined);
    const avgMatchScore =
      scoredJobs.length > 0
        ? Math.round(
            scoredJobs.reduce((sum, job) => sum + job.matchScore, 0) / scoredJobs.length
          )
        : 0;

    const skillCounts = {};
    jobs.forEach((job) => {
      const matched = job.skills?.matched || job.matchedSkills || [];
      matched.forEach((skill) => {
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
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const breakdown = await Job.aggregate([
      {
        $match: { userId },
      },
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
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const trends = await Job.aggregate([
      {
        $match: {
          userId,
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

