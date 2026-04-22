const Job = require('../models/Job');
const User = require('../models/User');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Normalize category to match Mongoose enum exactly
const normalizeCategory = (raw) => {
  if (!raw) return 'Jobs';
  const lower = raw.toLowerCase().trim();
  if (lower === 'jobs' || lower === 'job') return 'Jobs';
  if (lower === 'hackathons' || lower === 'hackathon') return 'Hackathons';
  if (lower === 'others' || lower === 'other') return 'Others';
  return 'Jobs'; // Default fallback
};

// Logic to handle the AI analysis and saving
exports.createJob = async (req, res) => {
  try {
    const incomingData = req.body;
    console.log("📥 Tracker received:", { title: incomingData.title, company: incomingData.company, url: incomingData.url?.substring(0, 60) });

    // 1. DYNAMIC FETCH: Get the user's actual resume from the DB
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: "User not found. Please log in again." });
    }

    // 2. Initialize Gemini 2.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze this job description.
      If the user has provided a resume, compare it to calculate a matchScore (0-100). If the User Resume says "NO_RESUME_PROVIDED", return matchScore as null.
      Return ONLY a raw JSON object (no markdown, no backticks). Use this exact structure:
      {
        "matchScore": <number or null>,
        "matchedSkills": [<strings>],
        "missingSkills": [<strings>],
        "location": "<string>",
        "salaryRange": "<string>",
        "category": "<'Jobs', 'Hackathons', or 'Others'>",
        "deadline": "<ISO date string or null>"
      }
      
      Job Description: ${(incomingData.description || '').substring(0, 4000)}
      User Resume: ${user.resumeText ? user.resumeText.substring(0, 3000) : "NO_RESUME_PROVIDED"} 
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
      console.log("🤖 Gemini raw response:", aiText.substring(0, 200));
      aiAnalysis = JSON.parse(aiText);
      
      // Enforce null match score if no resume is present
      if (!user.resumeText) {
        aiAnalysis.matchScore = null;
      }
    } catch (aiError) {
      console.warn("⚠️ Gemini AI failed. Saving job without AI insights.", aiError.message);
    }

    // 4. SANITIZE: Fix category to match Mongoose enum
    aiAnalysis.category = normalizeCategory(aiAnalysis.category);

    // 5. SANITIZE: Fix deadline — if it's an invalid date string, set to null
    if (aiAnalysis.deadline) {
      const parsed = new Date(aiAnalysis.deadline);
      aiAnalysis.deadline = isNaN(parsed.getTime()) ? null : parsed;
    }

    // 6. SECURE MERGE: Combine raw data, AI insights, and the User's unique ID
    const finalData = { 
      title: incomingData.title || 'Untitled Position',
      company: incomingData.company || 'Unknown Company',
      url: incomingData.url || 'https://unknown',
      description: incomingData.description || '',
      matchScore: aiAnalysis.matchScore,
      matchedSkills: aiAnalysis.matchedSkills || [],
      missingSkills: aiAnalysis.missingSkills || [],
      location: aiAnalysis.location || incomingData.location || '',
      salaryRange: aiAnalysis.salaryRange || incomingData.salaryRange || '',
      category: aiAnalysis.category,
      deadline: aiAnalysis.deadline || null,
      status: 'Saved',
      userId: req.user.id
    };

    console.log("💾 Saving job:", { title: finalData.title, company: finalData.company, matchScore: finalData.matchScore, category: finalData.category });

    const newJob = new Job(finalData);
    await newJob.save();

    console.log("✅ Job saved successfully! ID:", newJob._id);

    res.status(201).json({ 
      message: aiAnalysis.matchScore !== null 
        ? "AI Analysis Complete and Personalized!" 
        : "Job saved! Upload a resume to get Match Scores.", 
      job: newJob 
    });

  } catch (error) {
    console.error("❌ Tracker Controller Error:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Logic to get all jobs (Secure Dashboard Fetch)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

