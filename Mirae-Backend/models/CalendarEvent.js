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
  applyLink: {
    type: String,
    trim: true,
    default: '',
  },
  userId: {
    type: String,
    index: true,
    required: true,
  },
  googleEventId: {
    type: String,
    trim: true,
    default: '',
    index: true,
  },
  source: {
    type: String,
    enum: ['manual', 'dashboard', 'google'],
    default: 'manual',
    index: true,
  },
  sourceId: {
    type: String,
    trim: true,
    default: '',
    index: true,
  },
}, {
  timestamps: true,
});

calendarEventSchema.index({ userId: 1, date: 1 });
calendarEventSchema.index({ userId: 1, source: 1, sourceId: 1 });
calendarEventSchema.index({ userId: 1, googleEventId: 1 });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
