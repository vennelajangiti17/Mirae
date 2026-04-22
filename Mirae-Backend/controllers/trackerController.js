const Job = require('../models/Job');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Logic to handle the AI analysis and saving
exports.createJob = async (req, res) => {
  try {
    const incomingData = req.body;
    // Upgraded to the faster 2.5-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze this job description and my resume. 
      Return ONLY a JSON object with: 
      matchScore (0-100), matchedSkills (array), missingSkills (array), 
      location, salaryRange, category ('Jobs', 'Hackathons', or 'Others'), 
      and deadline (ISO string or null).
      
      Job: ${incomingData.description}
      Resume: Shreya Kumari, IIT Patna, React, Node.js, C++, MongoDB.
    `;

    const result = await model.generateContent(prompt);
    let aiText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const aiAnalysis = JSON.parse(aiText);

    // 🔐 SECURE ATTACHMENT: Merge the raw data, AI data, and the specific User's ID
    const finalData = { 
      ...incomingData, 
      ...aiAnalysis, 
      status: 'Saved',
      userId: req.user.id // This comes from your authMiddleware!
    };

    const newJob = new Job(finalData);
    await newJob.save();

    res.status(201).json({ message: "AI Analysis Complete!", job: newJob });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logic to get all jobs (for your dashboard)
exports.getAllJobs = async (req, res) => {
  try {
    // 🔐 SECURE FETCH: Only pull jobs that belong to the person asking
    const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
