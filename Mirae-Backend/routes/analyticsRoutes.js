const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getAnalyticsOverview,
  getTrends,
  getSkillGapAnalysis,
  getMatchInsights,
} = require('../controllers/analyticsController');

router.get('/overview', protect, getAnalyticsOverview);
router.get('/trends', protect, getTrends);
router.get('/skill-gap', protect, getSkillGapAnalysis);
router.get('/match-insights', protect, getMatchInsights);

module.exports = router;
