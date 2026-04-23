const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  startTime: {
    type: String,
    trim: true,
    default: '',
  },
  endTime: {
    type: String,
    trim: true,
    default: '',
  },
  type: {
    type: String,
    enum: ['interview', 'deadline', 'follow-up', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  userId: {
    type: String,
    index: true,
    default: '',
  },
  googleEventId: {
    type: String,
    trim: true,
    default: '',
    index: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
