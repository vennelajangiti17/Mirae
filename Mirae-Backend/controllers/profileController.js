const User = require('../models/User');

// Get the logged-in user's profile data
exports.getProfile = async (req, res) => {
  try {
    // req.user.id comes from your authMiddleware (the Bouncer)
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Save or update the user's resume text
exports.updateResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: "No resume text provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { resumeText },
      { new: true } // Returns the updated document
    ).select('-password');

    res.status(200).json({ 
      message: "✅ Resume updated successfully!", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Resume Update Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
