const Job = require('../models/Job');
const User = require('../models/User'); // 👈 IMPORTED: To fetch real resume data
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Logic to handle the AI analysis and saving
exports.createJob = async (req, res) => {
  try {
    const incomingData = req.body;

    // 1. 🔍 DYNAMIC FETCH: Get the user's actual resume from the DB
    const user = await User.findById(req.user.id);
    
    // 2. Initialize Gemini 2.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze this job description.
      If the user has provided a resume, compare it to calculate a matchScore (0-100). If the User Resume says "NO_RESUME_PROVIDED", return matchScore as null.
      Return ONLY a JSON object with: 
      matchScore (number or null), matchedSkills (array), missingSkills (array), 
      location, salaryRange, category ('Jobs', 'Hackathons', or 'Others'), 
      and deadline (ISO string or null).
      
      Job Description: ${incomingData.description}
      User Resume: ${user.resumeText ? user.resumeText : "NO_RESUME_PROVIDED"} 
    `;

    // 3. Run AI Analysis
    let aiAnalysis = { 
      matchScore: null, 
      matchedSkills: [], 
      missingSkills: [], 
      location: '', 
      salaryRange: '', 
      category: 'Jobs', 
      deadline: null 
    };

    try {
      const result = await model.generateContent(prompt);
      let aiText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      aiAnalysis = JSON.parse(aiText);
      
      // Enforce null match score if no resume is present, just in case AI hallucinates a score
      if (!user.resumeText) {
        aiAnalysis.matchScore = null;
      }
    } catch (aiError) {
      console.warn("⚠️ Gemini AI failed (e.g. invalid key or format). Saving job without AI insights.", aiError.message);
      // We don't throw here, we just let it proceed with the default empty aiAnalysis object.
    }

    // 4. 🔐 SECURE MERGE: Combine raw data, AI insights, and the User's unique ID
    const finalData = { 
      ...incomingData, 
      ...aiAnalysis, 
      status: 'Saved',
      userId: req.user.id // Secured by your authMiddleware
    };

    const newJob = new Job(finalData);
    await newJob.save();

    res.status(201).json({ 
      message: aiAnalysis.matchScore !== null ? "AI Analysis Complete and Personalized!" : "Saved job without AI Analysis due to an error.", 
      job: newJob 
    });

  } catch (error) {
    console.error("Tracker Controller Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Logic to get all jobs (Secure Dashboard Fetch)
exports.getAllJobs = async (req, res) => {
  try {
    // 🔐 Only pull jobs that belong to the logged-in user
    const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
