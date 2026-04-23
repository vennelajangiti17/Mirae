const CalendarEvent = require('../models/CalendarEvent');

exports.getAllEvents = async (req, res) => {
  try {
    const userId = req.user?.id;
    const query = userId ? { userId } : {};
    const events = await CalendarEvent.find(query).sort({ date: 1 });
    res.status(200).json({ events });
  } catch (error) {
    console.error('Calendar getAllEvents error:', error.message);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const query = userId ? { _id: req.params.id, userId } : { _id: req.params.id };
    const event = await CalendarEvent.findOne(query);
    if (!event) {
      return res.status(404).json({ error: 'Calendar event not found' });
    }
    res.status(200).json({ event });
  } catch (error) {
    console.error('Calendar getEventById error:', error.message);
    res.status(500).json({ error: 'Failed to fetch calendar event' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, type, status, location } = req.body;
    const userId = req.user?.id || '';

    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const newEvent = new CalendarEvent({
      title,
      description: description || '',
      date,
      startTime: startTime || '',
      endTime: endTime || '',
      type: type || 'other',
      status: status || 'pending',
      location: location || '',
      userId,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({ message: 'Calendar event created', event: savedEvent });
  } catch (error) {
    console.error('Calendar createEvent error:', error.message);
    res.status(500).json({ error: 'Failed to create calendar event' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const userId = req.user?.id;
    const query = userId ? { _id: req.params.id, userId } : { _id: req.params.id };
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      type: req.body.type,
      status: req.body.status,
      location: req.body.location,
    };

    const updatedEvent = await CalendarEvent.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Calendar event not found' });
    }

    res.status(200).json({ message: 'Calendar event updated', event: updatedEvent });
  } catch (error) {
    console.error('Calendar updateEvent error:', error.message);
    res.status(500).json({ error: 'Failed to update calendar event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const userId = req.user?.id;
    const query = userId ? { _id: req.params.id, userId } : { _id: req.params.id };
    const deletedEvent = await CalendarEvent.findOneAndDelete(query);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Calendar event not found' });
    }
    res.status(200).json({ message: 'Calendar event deleted' });
  } catch (error) {
    console.error('Calendar deleteEvent error:', error.message);
    res.status(500).json({ error: 'Failed to delete calendar event' });
  }
};
