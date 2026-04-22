// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job'); // Import the blueprint we just made

// POST route to receive data from the Chrome Extension
router.post('/', async (req, res) => {
  try {
    console.log("📥 Received new job data:", req.body);
    
    // Create a new job using the data sent in the request
    const newJob = new Job(req.body);
    
    // Save it to MongoDB Atlas
    const savedJob = await newJob.save();
    
    // Send a success message back
    res.status(201).json({ message: "Job saved to Mirae successfully!", job: savedJob });
  } catch (error) {
    console.error("❌ Error saving job:", error);
    res.status(500).json({ error: "Failed to save job" });
  }
});

module.exports = router;
