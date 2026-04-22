const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getRecentJobs,
} = require('../controllers/dashboardController');

router.get('/summary', getDashboardSummary);
router.get('/recent', getRecentJobs);

module.exports = router;
