const Job = require('../models/Job');
const User = require('../models/User');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SKILL_LIBRARY = [
  { label: 'JavaScript', terms: ['javascript', 'js'] },
  { label: 'TypeScript', terms: ['typescript', 'ts'] },
  { label: 'Python', terms: ['python'] },
  { label: 'Java', terms: ['java'] },
  { label: 'C++', terms: ['c++'] },
  { label: 'C#', terms: ['c#', 'c sharp'] },
  { label: 'Go', terms: ['golang', ' go '] },
  { label: 'Rust', terms: ['rust'] },
  { label: 'SQL', terms: ['sql', 'mysql', 'postgresql', 'postgres'] },
  { label: 'React', terms: ['react', 'react.js'] },
  { label: 'Node.js', terms: ['node.js', 'nodejs', 'node js'] },
  { label: 'Express.js', terms: ['express', 'express.js'] },
  { label: 'MongoDB', terms: ['mongodb', 'mongo db'] },
  { label: 'Docker', terms: ['docker'] },
  { label: 'Kubernetes', terms: ['kubernetes', 'k8s'] },
  { label: 'AWS', terms: ['aws', 'amazon web services'] },
  { label: 'Google Cloud', terms: ['google cloud', 'gcp'] },
  { label: 'Azure', terms: ['azure', 'microsoft azure'] },
  { label: 'Git', terms: ['git', 'github', 'gitlab'] },
  { label: 'Linux', terms: ['linux'] },
  { label: 'REST APIs', terms: ['rest api', 'restful api', 'rest apis'] },
  { label: 'GraphQL', terms: ['graphql'] },
  { label: 'System Design', terms: ['system design'] },
  { label: 'Distributed Systems', terms: ['distributed systems', 'distributed system'] },
  { label: 'Data Structures', terms: ['data structures'] },
  { label: 'Algorithms', terms: ['algorithms', 'algorithmic'] },
  { label: 'Software Development', terms: ['software development', 'software engineering'] },
  { label: 'Programming Languages', terms: ['programming languages', 'programming language'] },
  { label: 'Machine Learning', terms: ['machine learning', 'ml'] },
  { label: 'Data Science', terms: ['data science'] },
  { label: 'Artificial Intelligence', terms: ['artificial intelligence', 'ai '] },
  { label: 'Problem Solving', terms: ['problem solving', 'problem-solving'] },
  { label: 'Communication', terms: ['communication skills', 'communication'] },
  { label: 'Leadership', terms: ['leadership'] },
  { label: 'Mentoring', terms: ['mentor', 'mentoring'] },
  { label: 'Stakeholder Management', terms: ['stakeholder management', 'stakeholder'] },
  { label: 'Partnerships', terms: ['partnerships', 'partnership'] },
  { label: 'Program Management', terms: ['program management'] },
  { label: 'Project Management', terms: ['project management'] },
  { label: 'Product Management', terms: ['product management'] },
  { label: 'Testing', terms: ['testing', 'unit testing', 'integration testing'] },
  { label: 'Debugging', terms: ['debugging', 'debug'] },
];

const uniq = (items) => [...new Set(items.filter(Boolean))];

const extractSkillsFromText = (text = '') => {
  const haystack = ` ${String(text || '').toLowerCase()} `;
  return SKILL_LIBRARY
    .filter((entry) => entry.terms.some((term) => haystack.includes(` ${term.toLowerCase()} `) || haystack.includes(term.toLowerCase())))
    .map((entry) => entry.label);
};

const splitSkillsFromText = (value = '') => {
  return uniq(
    String(value || '')
      .split(/[\n,•|/]+/)
      .map((item) => item.trim())
      .filter(Boolean)
  );
};

const deriveSkillBuckets = ({ aiSkills, rawText, description, resumeText, hasResume }) => {
  const required = uniq([
    ...aiSkills.all,
    ...extractSkillsFromText(rawText),
    ...extractSkillsFromText(description),
  ]);

  const normalizedResume = ` ${String(resumeText || '').toLowerCase()} `;

  const matched = hasResume
    ? required.filter((skill) => {
        const libraryMatch = SKILL_LIBRARY.find((entry) => entry.label === skill);
        if (!libraryMatch) return normalizedResume.includes(skill.toLowerCase());
        return libraryMatch.terms.some((term) => normalizedResume.includes(` ${term.toLowerCase()} `) || normalizedResume.includes(term.toLowerCase()));
      })
    : [];

  const aiMatched = aiSkills.matched.filter((skill) => required.includes(skill));
  const finalMatched = uniq(hasResume ? [...matched, ...aiMatched] : []);
  const finalMissing = hasResume
    ? required.filter((skill) => !finalMatched.includes(skill))
    : required;

  return {
    all: required,
    matched: finalMatched,
    missing: uniq([...aiSkills.missing.filter((skill) => required.includes(skill)), ...finalMissing]),
  };
};

const deriveMatchScore = (providedScore, skills, hasResume) => {
  if (!hasResume) return null;
  if (typeof providedScore === 'number' && !Number.isNaN(providedScore)) return providedScore;
  if (!skills.all.length) return null;
  return Math.max(0, Math.min(100, Math.round((skills.matched.length / skills.all.length) * 100)));
};

// Helper: Normalize category into the dashboard's 3 buckets
const normalizeCategory = (raw, context = '') => {
  const rawValue = String(raw || '').toLowerCase().trim();
  const combined = `${raw || ''} ${context || ''}`.toLowerCase().trim();

  if (['jobs', 'job'].includes(rawValue)) return 'Jobs';
  if (['hackathons', 'hackathon', 'contest', 'contests'].includes(rawValue)) return 'Hackathons';
  if (['others', 'other'].includes(rawValue)) return 'Others';

  const hackathonKeywords = [
    'hackathon',
    'contest',
    'competition',
    'challenge',
    'ctf',
    'bounty',
    'buildathon'
  ];

  const strongJobKeywords = [
    'software engineer',
    'data scientist',
    'data science manager',
    'security engineer',
    'product manager',
    'designer',
    'developer',
    'engineer',
    'manager',
    'analyst',
    'specialist',
    'consultant',
    'recruiter',
    'full-time',
    'part-time',
    'apply now',
    'job description',
    'responsibilities',
    'qualifications',
    'requirements'
  ];

  const otherKeywords = [
    'workshop',
    'webinar',
    'session',
    'bootcamp',
    'masterclass',
    'fellowship',
    'scholarship',
    'meetup',
    'conference',
    'summit'
  ];

  if (hackathonKeywords.some((keyword) => combined.includes(keyword))) return 'Hackathons';
  if (strongJobKeywords.some((keyword) => combined.includes(keyword))) return 'Jobs';
  if (otherKeywords.some((keyword) => combined.includes(keyword))) return 'Others';

  return 'Others';
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

const parseDeadline = (raw) => {
  if (!raw) return null;

  const value = String(raw).trim();
  if (!value || /not specified|unknown|n\/a|none/i.test(value)) return null;

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  const numericMatch = value.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})/);
  if (numericMatch) {
    const [, a, b, c] = numericMatch;
    const year = c.length === 2 ? `20${c}` : c;
    const iso = new Date(`${year}-${b.padStart(2, '0')}-${a.padStart(2, '0')}`);
    if (!Number.isNaN(iso.getTime())) return iso;
  }

  return null;
};

const hasMeaningfulValue = (value) => {
  const text = String(value || '').trim();
  return Boolean(text) && !/^(not specified|unknown|n\/a|na|none|null|undefined)$/i.test(text);
};

// Main handler: AI analysis via Groq (Llama 3) + save
exports.createJob = async (req, res) => {
  try {
    const incomingData = req.body;

    // Support BOTH old format (title/company/description) and new omni-scraper format (rawText)
    const rawText = incomingData.rawText || incomingData.description || '';
    const url = incomingData.url || '';
    const isManualEntry = Boolean(incomingData.title && incomingData.company);

    console.log("📥 Tracker received:", { url: url.substring(0, 60), textLength: rawText.length });

    if (rawText.length < 50 && !isManualEntry) {
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

If you cannot find a specific detail, use "Not specified" or "Unknown". Only classify into Jobs, Hackathons, or Others. Anything that is not a job posting and not a hackathon/contest must be Others.

CRITICAL INSTRUCTION: I will also provide the candidate's current skills. You must compare the job's required skills against the candidate's skills to calculate a Match Score (0-100). Furthermore, you must categorize the job's required skills into "matched" (skills the candidate has) and "missing" (skills the candidate lacks). Never leave the skills arrays empty if the posting mentions technologies, tools, or competencies. Infer a concise required-skills list from the posting text when needed.

Candidate's Current Skills: ${userProfileSkills}

You MUST return ONLY valid JSON in this exact format:
{
  "title": "Exact Job Title",
  "company": "Company Name",
  "location": "City, State or Remote",
  "postedDate": "Date posted, e.g., 2 days ago or exact date",
  "salary": "Compensation range, e.g., $120k - $150k or ₹15LPA",
  "deadline": "Exact deadline date if present, otherwise empty string",
  "category": "Strictly one of: Jobs, Hackathons, Others",
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
      deadline: '',
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

    // 4. Prefer explicit manual values when the dashboard form provides them.
    const finalTitle = hasMeaningfulValue(incomingData.title)
      ? incomingData.title.trim()
      : hasMeaningfulValue(aiResult.title)
      ? aiResult.title
      : 'Untitled Position';

    const finalCompany = hasMeaningfulValue(incomingData.company)
      ? incomingData.company.trim()
      : (aiResult.company && aiResult.company !== 'Unknown Company' && aiResult.company !== 'Unknown')
      ? aiResult.company
      : companyFromUrl(url);

    // 5. Ensure skills object is properly formatted (defensive parsing)
    let safeSkills = { all: [], matched: [], missing: [] };
    const ensureArray = (val) => {
      if (Array.isArray(val)) return val.filter(v => typeof v === 'string');
      if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
      return [];
    };

    if (aiResult.skills) {
      if (Array.isArray(aiResult.skills)) {
        safeSkills.all = ensureArray(aiResult.skills);
        safeSkills.matched = [];
        safeSkills.missing = ensureArray(aiResult.skills);
      } else {
        safeSkills.all = uniq([
          ...ensureArray(aiResult.skills.all),
          ...splitSkillsFromText(aiResult.skills.required),
        ]);
        safeSkills.matched = ensureArray(aiResult.skills.matched);
        safeSkills.missing = ensureArray(aiResult.skills.missing);
      }
    }

    safeSkills = deriveSkillBuckets({
      aiSkills: safeSkills,
      rawText: rawText.substring(0, 6000),
      description: aiResult.description || '',
      resumeText: user.resumeText || '',
      hasResume,
    });

    let safeMatchScore = null;
    if (aiResult.matchScore !== undefined && aiResult.matchScore !== null) {
      const parsed = parseInt(String(aiResult.matchScore).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed)) safeMatchScore = parsed;
    }

    safeMatchScore = deriveMatchScore(safeMatchScore, safeSkills, hasResume);

    if (!hasResume) {
      safeSkills.matched = [];
      safeSkills.missing = safeSkills.all;
    }

    // Clean up description if it's too long or just raw text
    let safeDescription = aiResult.description || '';
    if (safeDescription.length > 2000) {
      safeDescription = safeDescription.substring(0, 2000) + '...';
    }
    
    const categoryContext = [
      aiResult.category,
      aiResult.title,
      aiResult.description,
      rawText.substring(0, 2000)
    ].join(' ');

    const finalCategory = normalizeCategory(incomingData.category || aiResult.category, categoryContext);
    const finalDeadline = parseDeadline(incomingData.deadline) || parseDeadline(aiResult.deadline);

    // 6. Build final document
    const createdAt = new Date();
    const finalData = {
      title: finalTitle,
      company: finalCompany,
      url: url || 'https://unknown',
      description: safeDescription,
      matchScore: safeMatchScore,
      skills: safeSkills,
      location: incomingData.location || aiResult.location || '',
      postedDate: aiResult.postedDate || '',
      salary: incomingData.salaryRange || incomingData.salary || aiResult.salary || aiResult.salaryRange || '',
      deadline: finalDeadline,
      category: finalCategory,
      status: 'Saved',
      history: [{ status: 'Saved', date: createdAt }],
      userId: req.user.id,
      createdAt,
      updatedAt: createdAt
    };

    console.log("💾 Saving job:", {
      title: finalData.title,
      company: finalData.company,
      matchScore: finalData.matchScore,
      skillsCount: finalData.skills?.all?.length,
      matchedCount: finalData.skills?.matched?.length,
      missingCount: finalData.skills?.missing?.length,
      category: finalData.category,
      deadline: finalData.deadline
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


// Delete one job for the logged-in user
exports.deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json({ message: 'Job deleted successfully', id: deletedJob._id });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};

// Update job status
exports.updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const job = await Job.findOne({ _id: req.params.id, userId: req.user.id });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status === status) {
      return res.status(200).json({ message: 'Job status unchanged', job });
    }

    job.status = status;
    job.history = Array.isArray(job.history) ? job.history : [];
    job.history.push({ status, date: new Date() });
    await job.save();

    res.status(200).json({ message: 'Job status updated successfully', job });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ error: 'Failed to update job status' });
  }
};


// Save networking contacts
exports.updateJobContacts = async (req, res) => {
  try {
    const recruiterName = String(req.body?.recruiterName || '').trim();
    const hiringManager = String(req.body?.hiringManager || '').trim();

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        $set: {
          contacts: {
            recruiterName,
            hiringManager,
          },
        },
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json({ message: 'Contacts saved successfully', job });
  } catch (error) {
    console.error('Update Contacts Error:', error);
    res.status(500).json({ error: 'Failed to save contacts' });
  }
};


// Save job notes
exports.updateJobNotes = async (req, res) => {
  try {
    const notes = String(req.body?.notes || '');

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        $set: {
          notes,
        },
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json({ message: 'Note saved successfully', job });
  } catch (error) {
    console.error('Update Notes Error:', error);
    res.status(500).json({ error: 'Failed to save note' });
  }
};

// Draft Cold Message
exports.draftColdMessage = async (req, res) => {
  try {
    const { companyName, jobTitle, recruiterName } = req.body;
    
    if (!companyName || !jobTitle) {
      return res.status(400).json({ error: "Company name and job title are required" });
    }

    const systemPrompt = "You are an expert career coach. Draft a short, professional, highly engaging 3-sentence LinkedIn connection request message to a recruiter. Use the provided company, job title, and recruiter name. Do not include placeholders like [Your Name]. Keep it under 300 characters.";
    const userMessage = `Company: ${companyName}\nJob Title: ${jobTitle}\nRecruiter Name: ${recruiterName || "Hiring Team"}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
    });

    const aiMessage = chatCompletion.choices[0]?.message?.content || "";
    res.status(200).json({ message: aiMessage.trim() });
  } catch (error) {
    console.error('Draft Cold Message Error:', error);
    res.status(500).json({ error: "Failed to generate cold message" });
  }
};

// Tailor Resume Bullet
exports.tailorBullet = async (req, res) => {
  try {
    const { jobDescription, originalBullet } = req.body;

    if (!jobDescription || !originalBullet) {
      return res.status(400).json({ error: "Job description and original bullet are required" });
    }

    const systemPrompt = "You are an expert resume writer. The user will provide a generic resume bullet point and a target job description. Rewrite the bullet point to be highly impactful, incorporating relevant keywords from the job description naturally. Use the STAR method if possible. Return ONLY the rewritten bullet point text, nothing else.";
    const userMessage = `Job Description:\n${jobDescription}\n\nOriginal Bullet Point:\n${originalBullet}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      model: "llama3-8b-8192",
      temperature: 0.5,
    });

    const aiBullet = chatCompletion.choices[0]?.message?.content || "";
    res.status(200).json({ bullet: aiBullet.trim() });
  } catch (error) {
    console.error('Tailor Bullet Error:', error);
    res.status(500).json({ error: "Failed to tailor bullet point" });
  }
};
