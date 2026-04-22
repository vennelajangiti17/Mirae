const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  // 📄 NEW: This stores the text extracted from the user's resume
  // The AI will pull from here instead of using hardcoded details!
  resumeText: {
    type: String,
    default: "",
  },
  socialLinks: [{
    id: String,
    platform: String,
    title: String,
    url: String,
    icon: String,
  }]
}, {
  // Automatically manages 'createdAt' and 'updatedAt' fields
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
