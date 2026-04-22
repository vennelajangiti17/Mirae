const Job = require('../models/Job');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Logic to handle the AI analysis
exports.createJob = async (req, res) => {
  try {
    const incomingData = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const finalData = { ...incomingData, ...aiAnalysis, status: 'Saved' };
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
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
