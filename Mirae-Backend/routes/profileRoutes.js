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
 * @route   POST /api/profile/resume/upload
 * @desc    Upload a resume file (PDF or TXT) — parses and extracts text
 * @access  Private
 */
router.post('/resume/upload', protect, profileController.uploadMiddleware, profileController.uploadResume);

/**
 * @route   PUT /api/profile/resume
 * @desc    Update/Save user's resume text for AI analysis (legacy JSON endpoint)
 * @access  Private
 */
router.put('/resume', protect, profileController.updateResume);

/**
 * @route   DELETE /api/profile/resume
 * @desc    Delete the user's uploaded resume
 * @access  Private
 */
router.delete('/resume', protect, profileController.deleteResume);

/**
 * @route   PUT /api/profile/social-links
 * @desc    Update/Save user's social portfolio links
 * @access  Private
 */
router.put('/social-links', protect, profileController.updateSocialLinks);

module.exports = router;
