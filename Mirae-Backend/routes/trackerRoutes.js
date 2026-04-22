const express = require('express');
const router = express.Router();
const trackerController = require('../controllers/trackerController');

// When the extension sends data (POST)
router.post('/', trackerController.createJob);

// When the React dashboard asks for data (GET)
router.get('/', trackerController.getAllJobs);

module.exports = router;
