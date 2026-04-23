const Job = require('../models/Job');
const mongoose = require('mongoose');

const getAnalyticsOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await Job.find({ userId, category: 'Jobs' }).select(
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
      const requiredSkills = job.skills?.all || job.skills?.matched || job.matchedSkills || [];
      requiredSkills.forEach((skill) => {
        if (!skill || skill === 'Unknown' || skill === 'Not specified') return;
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

const getTrends = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const trends = await Job.aggregate([
      {
        $match: {
          userId,
          category: 'Jobs',
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


const getSkillGapAnalysis = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const skillGapData = await Job.aggregate([
      { $match: { userId, category: 'Jobs' } },
      { $unwind: '$skills.missing' },
      {
        $match: {
          'skills.missing': {
            $type: 'string',
            $nin: ['', 'Unknown', 'Not specified'],
          },
        },
      },
      {
        $group: {
          _id: '$skills.missing',
          frequency: { $sum: 1 },
        },
      },
      { $sort: { frequency: -1, _id: 1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          skill: '$_id',
          frequency: 1,
        },
      },
    ]);

    res.status(200).json(skillGapData);
  } catch (error) {
    console.error('[Analytics API] Skill gap error:', error);
    res.status(500).json({ error: 'Failed to fetch skill gap analysis' });
  }
};

const getMatchInsights = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const [result] = await Job.aggregate([
      {
        $match: {
          userId,
          category: 'Jobs',
        },
      },
      {
        $facet: {
          allJobsAverage: [
            { $match: { matchScore: { $ne: null } } },
            { $group: { _id: null, avgScore: { $avg: '$matchScore' } } },
          ],
          interviewAverage: [
            {
              $match: {
                status: { $in: ['Interviewing', 'Offer', 'Offered'] },
                matchScore: { $ne: null },
              },
            },
            { $group: { _id: null, avgScore: { $avg: '$matchScore' } } },
          ],
          rejectedJobs: [
            { $match: { status: 'Rejected' } },
            { $sort: { updatedAt: -1 } },
            { $limit: 4 },
            {
              $project: {
                _id: 0,
                company: 1,
                title: 1,
                rejectionReason: 1,
              },
            },
          ],
          offeredJobs: [
            { $match: { status: { $in: ['Offer', 'Offered'] } } },
            { $sort: { updatedAt: -1 } },
            { $limit: 4 },
            {
              $project: {
                _id: 0,
                company: 1,
                title: 1,
              },
            },
          ],
        },
      },
    ]);

    const allJobsAverage = Math.round(result?.allJobsAverage?.[0]?.avgScore || 0);
    const interviewAverage = Math.round(result?.interviewAverage?.[0]?.avgScore || 0);

    res.status(200).json({
      allJobsAverage,
      interviewAverage,
      rejectedJobs: result?.rejectedJobs || [],
      offeredJobs: result?.offeredJobs || [],
    });
  } catch (error) {
    console.error('[Analytics API] Match insights error:', error);
    res.status(500).json({ error: 'Failed to fetch match insights' });
  }
};

module.exports = {
  getAnalyticsOverview,
  getTrends,
  getSkillGapAnalysis,
  getMatchInsights,
};

