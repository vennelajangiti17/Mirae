// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB Database!'))
  .catch((error) => console.error('❌ Error connecting to MongoDB:', error.message));

// --- API ROUTES ---
const jobRoutes = require('./routes/jobRoutes'); // Import the routes
app.use('/api/jobs', jobRoutes); // Tell the server to use them

// --- HEALTH CHECK ---
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Mirae Backend is running perfectly! 🚀' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌟 Server is listening on port ${PORT}`);
});
