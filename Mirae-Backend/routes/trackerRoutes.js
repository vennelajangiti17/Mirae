const express = require('express');
const router = express.Router();
const trackerController = require('../controllers/trackerController');

// 🔐 Import the Bouncer (Authentication Middleware)
const { protect } = require('../middlewares/authMiddleware');

// When the extension sends data (POST) - Now protected!
router.post('/', protect, trackerController.createJob);

// When the React dashboard asks for data (GET) - Now protected!
router.get('/', protect, trackerController.getAllJobs);

module.exports = router;
