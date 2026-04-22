const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getAnalyticsOverview,
  getStatusBreakdown,
  getTrends,
} = require('../controllers/analyticsController');

router.get('/overview', protect, getAnalyticsOverview);
router.get('/status-breakdown', protect, getStatusBreakdown);
router.get('/trends', protect, getTrends);

module.exports = router;
