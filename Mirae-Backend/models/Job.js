const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // 🔐 NEW: Tie this job to a specific user account
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // 1. Core Scraped Data (From the Chrome Extension)
  title: { type: String, required: true },
  company: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  
  // 2. Kanban Dashboard Status
  status: {
    type: String,
    enum: ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'],
    default: 'Saved' // Every new scraped job starts here automatically
  },

  // 3. Smart Features (Populated later by your AI backend)
  matchScore: { type: Number, default: null }, // e.g., 88
  skills: {
    all: { type: [String], default: [] },
    matched: { type: [String], default: [] },
    missing: { type: [String], default: [] }
  },
  postedDate: { type: String, default: '' },

  // 4. Details (Can be scraped, or added manually later via your popup form)
  location: { type: String, default: '' },
  salary: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Jobs', 'Hackathons', 'Others', 'Internships', 'Open Source', 'Other'], 
    default: 'Jobs' 
  },
  
  // 5. Timeline & Tracking
  deadline: { type: Date, default: null },
  appliedDate: { type: Date, default: null },
  notes: { type: String, default: '' }

}, { 
  // This automatically adds 'createdAt' and 'updatedAt' timestamps to every document!
  timestamps: true 
});

jobSchema.index({ userId: 1, status: 1, matchScore: -1 });

module.exports = mongoose.model('Job', jobSchema);
