const express = require('express');
const router = express.Router();
const {
  getAnalyticsOverview,
  getStatusBreakdown,
  getTrends,
} = require('../controllers/analyticsController');

router.get('/overview', getAnalyticsOverview);
router.get('/status-breakdown', getStatusBreakdown);
router.get('/trends', getTrends);

module.exports = router;
