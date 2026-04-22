const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// 🔐 Import your authentication middleware (the Bouncer)
// This ensures 'req.user' is populated with the user's ID
const { protect } = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/profile
 * @desc    Get current user's profile (name, email, resume text)
 * @access  Private
 */
router.get('/', protect, profileController.getProfile);

/**
 * @route   PUT /api/profile/resume
 * @desc    Update/Save user's resume text for AI analysis
 * @access  Private
 */
router.put('/resume', protect, profileController.updateResume);

module.exports = router;
