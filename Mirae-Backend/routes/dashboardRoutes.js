const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getDashboardSummary,
  getRecentJobs,
} = require('../controllers/dashboardController');

router.get('/summary', protect, getDashboardSummary);
router.get('/recent', protect, getRecentJobs);

module.exports = router;
