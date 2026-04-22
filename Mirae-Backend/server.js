// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 1. Import your new database configuration file
const connectDB = require('./config/db'); 

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 2. Call the database connection function
connectDB();

// 3. Point to the new tracker routes from your team's scaffold
const trackerRoutes = require('./routes/trackerRoutes'); 
app.use('/api/tracker', trackerRoutes); 

// --- HEALTH CHECK ---
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Mirae Backend is running perfectly! 🚀' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌟 Server is listening on port ${PORT}`);
});
