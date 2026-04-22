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
  return 'Jobs';
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

    const hasResume = !!(user.resumeText && user.resumeText.trim().length > 0);

    const prompt = `
      You are an expert job analyzer. Analyze this job listing and extract structured data.
      
      IMPORTANT RULES:
      - Return ONLY a raw JSON object. No markdown. No backticks. No explanations.
      - "requiredSkills" should ALWAYS list the technical skills, tools, languages, and frameworks mentioned in the job description (e.g. Python, SQL, AWS, React, Docker, etc.). This is NOT dependent on the user's resume. Always extract these.
      - "companyName" should be the hiring company name. Extract it from the job description, URL domain, or "About Us" section. For example, if the URL contains "amazon.jobs", the company is "Amazon".
      - "jobTitle" should be the clean, standardized job title from the listing.
      ${hasResume 
        ? '- Compare the job requirements against the user resume to calculate matchScore (0-100), matchedSkills (skills the user HAS from requiredSkills), and missingSkills (skills from requiredSkills the user LACKS).' 
        : '- The user has NO resume uploaded. Set matchScore to null. Set matchedSkills to []. Set missingSkills to [].'}

      Return this exact JSON structure:
      {
        "companyName": "<company name>",
        "jobTitle": "<clean job title>",
        "matchScore": ${hasResume ? '<number 0-100>' : 'null'},
        "requiredSkills": ["<skill1>", "<skill2>", "..."],
        "matchedSkills": [${hasResume ? '"<skills user has>"' : ''}],
        "missingSkills": [${hasResume ? '"<skills user lacks>"' : ''}],
        "location": "<location or empty string>",
        "salaryRange": "<salary range or empty string>",
        "category": "<Jobs or Hackathons or Others>",
        "deadline": "<ISO date string or null>"
      }

      Job URL: ${incomingData.url || 'unknown'}
      Job Title (scraped): ${incomingData.title || 'unknown'}
      Company (scraped): ${incomingData.company || 'unknown'}
      
      Job Description:
      ${(incomingData.description || '').substring(0, 4000)}

      ${hasResume ? `User Resume:\n${user.resumeText.substring(0, 3000)}` : 'User Resume: NO_RESUME_PROVIDED'}
    `;

    // 3. Run AI Analysis
    let aiAnalysis = { 
      companyName: '',
      jobTitle: '',
      matchScore: null, 
      requiredSkills: [],
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
      console.log("🤖 Gemini raw response:", aiText.substring(0, 300));
      aiAnalysis = JSON.parse(aiText);
      
      // Enforce null match score if no resume is present
      if (!hasResume) {
        aiAnalysis.matchScore = null;
        aiAnalysis.matchedSkills = [];
        aiAnalysis.missingSkills = [];
      }
    } catch (aiError) {
      console.warn("⚠️ Gemini AI failed. Saving job without AI insights.", aiError.message);
    }

    // 4. SANITIZE: Fix category to match Mongoose enum
    aiAnalysis.category = normalizeCategory(aiAnalysis.category);

    // 5. SANITIZE: Fix deadline
    if (aiAnalysis.deadline) {
      const parsed = new Date(aiAnalysis.deadline);
      aiAnalysis.deadline = isNaN(parsed.getTime()) ? null : parsed;
    }

    // 6. Use AI-extracted company/title as fallback when scraper fails
    let finalCompany = incomingData.company;
    if (!finalCompany || finalCompany === 'Could not detect') {
      if (aiAnalysis.companyName) {
        finalCompany = aiAnalysis.companyName;
      } else {
        // Ultimate fallback: extract from URL if AI also failed (e.g. due to 503 error)
        try {
          const urlObj = new URL(incomingData.url);
          const hostnameParts = urlObj.hostname.replace('www.', '').split('.');
          finalCompany = hostnameParts[0].charAt(0).toUpperCase() + hostnameParts[0].slice(1);
        } catch (e) {
          finalCompany = 'Unknown Company';
        }
      }
    }

    const finalTitle = (incomingData.title && incomingData.title !== 'Could not detect')
      ? incomingData.title
      : (aiAnalysis.jobTitle || 'Untitled Position');

    // 7. Use requiredSkills as the primary skills list for the job card
    // matchedSkills = skills the job requires (shown on card)
    // missingSkills = skills user lacks (shown in detail drawer)
    const skillsForCard = (aiAnalysis.requiredSkills && aiAnalysis.requiredSkills.length > 0) 
      ? aiAnalysis.requiredSkills 
      : (aiAnalysis.matchedSkills || []);

    // 8. SECURE MERGE
    const finalData = { 
      title: finalTitle,
      company: finalCompany,
      url: incomingData.url || 'https://unknown',
      description: incomingData.description || '',
      matchScore: aiAnalysis.matchScore,
      matchedSkills: skillsForCard,
      missingSkills: aiAnalysis.missingSkills || [],
      location: aiAnalysis.location || incomingData.location || '',
      salaryRange: aiAnalysis.salaryRange || incomingData.salaryRange || '',
      category: aiAnalysis.category,
      deadline: aiAnalysis.deadline || null,
      status: 'Saved',
      userId: req.user.id
    };

    console.log("💾 Saving job:", { title: finalData.title, company: finalData.company, matchScore: finalData.matchScore, category: finalData.category, skills: finalData.matchedSkills?.length });

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
