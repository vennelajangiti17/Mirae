const Job = require('../models/Job');
const User = require('../models/User');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper: Normalize category to match Mongoose enum exactly
const normalizeCategory = (raw) => {
  if (!raw) return 'Jobs';
  const lower = raw.toLowerCase().trim();
  if (lower === 'jobs' || lower === 'job') return 'Jobs';
  if (lower === 'hackathons' || lower === 'hackathon') return 'Hackathons';
  if (lower === 'others' || lower === 'other') return 'Others';
  return 'Jobs';
};

// Helper: Extract company name from URL as last resort
const companyFromUrl = (url) => {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    const name = hostname.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return 'Unknown Company';
  }
};

// Main handler: AI analysis via Groq (Llama 3) + save
exports.createJob = async (req, res) => {
  try {
    const incomingData = req.body;

    // Support BOTH old format (title/company/description) and new omni-scraper format (rawText)
    const rawText = incomingData.rawText || incomingData.description || '';
    const url = incomingData.url || '';

    console.log("📥 Tracker received:", { url: url.substring(0, 60), textLength: rawText.length });

    if (rawText.length < 50) {
      return res.status(400).json({ error: "Not enough text captured from the page. Try refreshing and scraping again." });
    }

    // 1. Fetch user's resume from DB
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: "User not found. Please log in again." });
    }

    const hasResume = !!(user.resumeText && user.resumeText.trim().length > 20);
    // Grab the user's skills from the database (fallback to resume text or a default string)
    const userProfileSkills = hasResume ? user.resumeText.substring(0, 3000) : "React, Node.js, MongoDB, JavaScript, Python";

    // 2. The Omni-Extraction Prompt
    const systemPrompt = `You are an expert technical recruiter and data extractor. 
I will provide you with the raw text scraped from a job board webpage. 
Your job is to find the job details and return a strict JSON object.

If you cannot find a specific detail, use "Not specified" or "Unknown".

CRITICAL INSTRUCTION: I will also provide the candidate's current skills. You must compare the job's required skills against the candidate's skills to calculate a Match Score (0-100). Furthermore, you must categorize the job's required skills into "matched" (skills the candidate has) and "missing" (skills the candidate lacks).

Candidate's Current Skills: ${userProfileSkills}

You MUST return ONLY valid JSON in this exact format:
{
  "title": "Exact Job Title",
  "company": "Company Name",
  "location": "City, State or Remote",
  "postedDate": "Date posted, e.g., 2 days ago or exact date",
  "salary": "Compensation range, e.g., $120k - $150k or ₹15LPA",
  "category": "Strictly one of: Jobs, Internships, Hackathons, Open Source, or Other",
  "description": "A clean 2-paragraph summary of the job and requirements",
  "matchScore": 85,
  "skills": {
    "all": ["skill1", "skill2", "skill3", "skill4"],
    "matched": ["skill1", "skill2"],
    "missing": ["skill3", "skill4"]
  }
}`;

    const userMessage = `Job URL: ${url}

Here is the webpage text:

${rawText.substring(0, 6000)}`;

    // 3. Call Groq AI (Llama 3 — fast, free, guaranteed JSON)
    let aiResult = {
      title: 'Untitled Position',
      company: companyFromUrl(url),
      location: '',
      postedDate: '',
      salary: '',
      category: 'Jobs',
      description: '',
      matchScore: null,
      skills: {
        all: [],
        matched: [],
        missing: []
      }
    };

    try {
      console.log("🧠 Calling Groq AI (Llama 3)...");
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }, // Forces perfect JSON output!
        temperature: 0.2,
      });

      const aiText = chatCompletion.choices[0].message.content;
      console.log("🤖 Groq raw response:", aiText.substring(0, 300));
      aiResult = JSON.parse(aiText);

      // Enforce null match score if no resume
      if (!hasResume) {
        aiResult.matchScore = null;
        if (aiResult.skills) {
          aiResult.skills.matched = [];
          aiResult.skills.missing = [];
        }
      }
    } catch (aiError) {
      console.warn("⚠️ Groq AI failed. Saving with URL-based fallback.", aiError.message);
    }

    // 4. Fallback company from URL if AI also couldn't find it
    const finalCompany = (aiResult.company && aiResult.company !== 'Unknown Company' && aiResult.company !== 'Unknown')
      ? aiResult.company
      : companyFromUrl(url);

    // 5. Ensure skills object is properly formatted
    const safeSkills = {
      all: aiResult.skills?.all || [],
      matched: aiResult.skills?.matched || [],
      missing: aiResult.skills?.missing || []
    };
    
    // Normalize category
    const validCategories = ['Jobs', 'Internships', 'Hackathons', 'Open Source', 'Other'];
    let finalCategory = 'Jobs';
    if (aiResult.category) {
      const match = validCategories.find(c => c.toLowerCase() === aiResult.category.toLowerCase());
      if (match) finalCategory = match;
      else if (aiResult.category.toLowerCase() === 'others') finalCategory = 'Other';
    }

    // 6. Build final document
    const finalData = {
      title: aiResult.title || 'Untitled Position',
      company: finalCompany,
      url: url || 'https://unknown',
      description: aiResult.description || '',
      matchScore: aiResult.matchScore,
      skills: safeSkills,
      location: aiResult.location || '',
      postedDate: aiResult.postedDate || '',
      salary: aiResult.salary || aiResult.salaryRange || '',
      category: finalCategory,
      status: 'Saved',
      userId: req.user.id
    };

    console.log("💾 Saving job:", {
      title: finalData.title,
      company: finalData.company,
      matchScore: finalData.matchScore,
      skillsCount: finalData.skills?.all?.length
    });

    const newJob = new Job(finalData);
    await newJob.save();

    console.log("✅ Job saved successfully! ID:", newJob._id);

    res.status(201).json({
      message: aiResult.matchScore !== null
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

// Get all jobs (Secure Dashboard Fetch)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
