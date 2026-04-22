// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini using your secret key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🧠 The Smart Extractor Engine
const analyzeJobWithAI = async (jobDescription) => {
  try {
    // We use the flash model because it is fast and perfect for text extraction
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Hardcoded for now. Later, you will fetch this from the logged-in user's DB profile!
    const myResumeText = `
      Shreya Kumari, Computer Science and Engineering student at IIT Patna (2401CS26).
      Expected Graduation: 2028. CPI: 9.16. 
      Skills: React, Node.js, Express, MongoDB, C++, JavaScript, Python.
      Experience: Built 'Argus' (financial simulator) using Node/React, and 'Velora' (route optimization app).
      Active competitive programmer on Codeforces.
    `;

    // The Master Prompt: Forcing the AI to return ONLY clean JSON
    const prompt = `
      You are an elite technical recruiter and data parser. 
      I will give you a messy, unstructured job description scraped from a website, and my current resume.
      
      Your tasks:
      1. Extract all concrete details about the job (location, salary, deadline). If a detail is missing, return null.
      2. Compare the job requirements to my resume to calculate a realistic Match Score (0-100).
      3. Identify which skills I have (matched) and which I need to learn (missing).
      
      You MUST return ONLY a raw JSON object. Do not include markdown formatting, backticks, or explanations. Use this exact structure:
      {
        "matchScore": <number>,
        "matchedSkills": [<strings>],
        "missingSkills": [<strings>],
        "location": "<string or null>",
        "salaryRange": "<string or null>",
        "category": "<'Jobs', 'Hackathons', or 'Others'>",
        "deadline": "<ISO Date string or null>"
      }

      Job Description:
      ${jobDescription}

      My Resume:
      ${myResumeText}
    `;

    // Ask Gemini to generate the response
    const result = await model.generateContent(prompt);
    let aiText = result.response.text();
    
    // Clean up the response just in case the AI added markdown code blocks
    aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Convert the AI's text string back into a real JavaScript object
    return JSON.parse(aiText);

  } catch (error) {
    console.error("AI Extraction Failed:", error);
    // If the AI fails (e.g., rate limits), return safe default data so the app doesn't crash
    return {
      matchScore: null, matchedSkills: [], missingSkills: [],
      location: '', salaryRange: '', category: 'Jobs', deadline: null
    };
  }
};

router.post('/', async (req, res) => {
  try {
    console.log("📥 Received raw scraped data for:", req.body.title);
    const incomingData = req.body;

    console.log("🤖 Sending to Gemini for deep extraction and matching...");
    
    // Pass the raw description to our AI function
    const aiExtractedData = await analyzeJobWithAI(incomingData.description);

    // Merge the raw web data (title, company, url) with the AI's smart data
    const finalJobDocument = {
      ...incomingData,            // title, company, url, description
      ...aiExtractedData,         // matchScore, skills, salary, location, etc.
      status: 'Saved'             // Hardcode initial status
    };

    // Save the ultimate, enriched document to MongoDB
    const newJob = new Job(finalJobDocument);
    const savedJob = await newJob.save();
    
    console.log(`✅ Success! Saved to DB with Match Score: ${savedJob.matchScore}%`);
    res.status(201).json({ message: "Job analyzed and saved!", job: savedJob });

  } catch (error) {
    console.error("❌ Error processing job:", error);
    res.status(500).json({ error: "Failed to process and save job" });
  }
});

module.exports = router;
