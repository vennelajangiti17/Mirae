// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String }, // Not required, just in case scraping fails
  status: {
    type: String,
    enum: ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'],
    default: 'Saved' // Every new scraped job starts as 'Saved'
  },
  dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
