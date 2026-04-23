const User = require('../models/User');
const multer = require('multer');
const pdfParse = require('pdf-parse');

// Configure multer to store file in memory (no disk writes needed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain', 'text/markdown'];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith('.txt') || file.originalname.endsWith('.md')) {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf, .txt, and .md files are allowed.'));
    }
  }
});

// Export the multer middleware so routes can use it
exports.uploadMiddleware = upload.single('resume');

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

// Upload and parse a resume file (PDF or TXT), then save extracted text
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Please select a .pdf or .txt file." });
    }

    console.log("📄 Resume upload received:", req.file.originalname, `(${req.file.mimetype}, ${(req.file.size / 1024).toFixed(1)}KB)`);

    let extractedText = '';

    if (req.file.mimetype === 'application/pdf') {
      // Parse PDF binary buffer to extract text
      try {
        const pdfData = await pdfParse(req.file.buffer);
        extractedText = pdfData.text;
        console.log(`📑 PDF parsed: ${pdfData.numpages} pages, ${extractedText.length} chars extracted`);
      } catch (pdfErr) {
        console.error("❌ PDF parsing failed:", pdfErr.message);
        return res.status(400).json({ error: "Could not parse this PDF. It may be scanned or image-based. Try a text-based PDF or .txt file." });
      }
    } else {
      // Plain text files (.txt, .md)
      extractedText = req.file.buffer.toString('utf-8');
      console.log(`📝 Text file read: ${extractedText.length} chars`);
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({ error: "The uploaded file appears to be empty or too short. Please upload a file with actual resume content." });
    }

    // Save the extracted text and file metadata to the user record
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        resumeText: extractedText.trim(),
        resumeFileName: req.file.originalname,
        resumeUploadedAt: new Date()
      },
      { new: true }
    ).select('-password');

    console.log("✅ Resume saved for user:", updatedUser.name, `(${extractedText.trim().length} chars)`);

    res.status(200).json({ 
      message: "✅ Resume uploaded and AI Profile updated!", 
      user: updatedUser,
      stats: {
        fileName: req.file.originalname,
        charCount: extractedText.trim().length,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Resume Upload Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Save or update the user's resume text (legacy JSON endpoint — kept for backward compat)
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

// Save or update the user's social links array
exports.updateSocialLinks = async (req, res) => {
  try {
    const { socialLinks } = req.body;

    if (!Array.isArray(socialLinks)) {
      return res.status(400).json({ error: "Social links must be an array" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { socialLinks },
      { new: true }
    ).select('-password');

    res.status(200).json({ 
      message: "✅ Social portfolio updated successfully!", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Social Links Update Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete the user's resume
exports.deleteResume = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        resumeText: '',
        resumeFileName: '',
        resumeUploadedAt: null
      },
      { new: true }
    ).select('-password');

    res.status(200).json({ 
      message: "Resume deleted successfully.", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Resume Delete Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
