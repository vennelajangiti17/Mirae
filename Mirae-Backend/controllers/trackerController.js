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
    
    // Fallback if they haven't uploaded a resume yet
    const resumeToUse = user.resumeText || "No resume provided yet. Focus on extracting job details.";

    // 2. Initialize Gemini 2.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze this job description and the user's resume provided below. 
      Return ONLY a JSON object with: 
      matchScore (0-100), matchedSkills (array), missingSkills (array), 
      location, salaryRange, category ('Jobs', 'Hackathons', or 'Others'), 
      and deadline (ISO string or null).
      
      Job Description: ${incomingData.description}
      User Resume: ${resumeToUse} 
    `;

    // 3. Run AI Analysis
    const result = await model.generateContent(prompt);
    let aiText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const aiAnalysis = JSON.parse(aiText);

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
      message: "AI Analysis Complete and Personalized!", 
      job: newJob 
    });

  } catch (error) {
    console.error("Tracker Controller Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
