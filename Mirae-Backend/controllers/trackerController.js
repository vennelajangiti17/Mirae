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

    // 2. Build the AI prompt
    const systemPrompt = `You are an expert technical recruiter and data extractor.
I will provide you with the raw text scraped from a job board webpage.
Your job is to find the job details hidden in the text and return a strict JSON object.

RULES:
- Extract the exact job title from the listing.
- Extract the company name. If you cannot find it, check the URL domain I provide.
- "requiredSkills" must ALWAYS list every technical skill, tool, language, and framework mentioned (e.g. Python, SQL, AWS, React, Docker, Kubernetes, etc). Extract ALL of them.
- "description" should be a clean 2-3 paragraph summary of the role and its requirements.
- "category" must be one of: "Jobs", "Hackathons", or "Others".
- "location" should be the job location if mentioned, otherwise empty string.
- "salaryRange" should be the salary/compensation if mentioned, otherwise empty string.
- "deadline" should be the application deadline as an ISO date string if mentioned, otherwise null.
${hasResume
  ? `- Compare the required skills against the user's resume to calculate "matchScore" (0-100), "matchedSkills" (skills the user HAS), and "missingSkills" (skills the user LACKS).`
  : `- The user has NO resume. Set "matchScore" to null, "matchedSkills" to [], and "missingSkills" to [].`
}

You MUST return ONLY valid JSON in this exact format, with no markdown formatting or extra text:
{
  "title": "Exact Job Title",
  "company": "Company Name",
  "description": "Clean summary of the job",
  "requiredSkills": ["skill1", "skill2"],
  "matchScore": ${hasResume ? '85' : 'null'},
  "matchedSkills": [],
  "missingSkills": [],
  "location": "",
  "salaryRange": "",
  "category": "Jobs",
  "deadline": null
}`;

    const userMessage = `Job URL: ${url}
${hasResume ? `\nUser Resume (for match scoring):\n${user.resumeText.substring(0, 3000)}` : ''}

Here is the webpage text:

${rawText.substring(0, 6000)}`;

    // 3. Call Groq AI (Llama 3 — fast, free, guaranteed JSON)
    let aiResult = {
      title: 'Untitled Position',
      company: companyFromUrl(url),
      description: '',
      requiredSkills: [],
      matchScore: null,
      matchedSkills: [],
      missingSkills: [],
      location: '',
      salaryRange: '',
      category: 'Jobs',
      deadline: null
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
        aiResult.matchedSkills = [];
        aiResult.missingSkills = [];
      }
    } catch (aiError) {
      console.warn("⚠️ Groq AI failed. Saving with URL-based fallback.", aiError.message);
    }

    // 4. Sanitize category
    aiResult.category = normalizeCategory(aiResult.category);

    // 5. Sanitize deadline
    if (aiResult.deadline) {
      const parsed = new Date(aiResult.deadline);
      aiResult.deadline = isNaN(parsed.getTime()) ? null : parsed;
    }

    // 6. Fallback company from URL if AI also couldn't find it
    const finalCompany = (aiResult.company && aiResult.company !== 'Unknown Company')
      ? aiResult.company
      : companyFromUrl(url);

    // 7. Use requiredSkills as primary for the card
    const skillsForCard = (aiResult.requiredSkills && aiResult.requiredSkills.length > 0)
      ? aiResult.requiredSkills
      : (aiResult.matchedSkills || []);

    // 8. Build final document
    const finalData = {
      title: aiResult.title || 'Untitled Position',
      company: finalCompany,
      url: url || 'https://unknown',
      description: aiResult.description || '',
      matchScore: aiResult.matchScore,
      matchedSkills: skillsForCard,
      missingSkills: aiResult.missingSkills || [],
      location: aiResult.location || '',
      salaryRange: aiResult.salaryRange || '',
      category: aiResult.category,
      deadline: aiResult.deadline || null,
      status: 'Saved',
      userId: req.user.id
    };

    console.log("💾 Saving job:", {
      title: finalData.title,
      company: finalData.company,
      matchScore: finalData.matchScore,
      category: finalData.category,
      skills: finalData.matchedSkills?.length
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
