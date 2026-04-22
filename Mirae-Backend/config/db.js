// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connects using the secret URI in your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Successfully connected to MongoDB Database!');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    // If the database fails to connect, stop the server completely
    process.exit(1); 
  }
};

module.exports = connectDB;
