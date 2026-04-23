const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.get('/', calendarController.getAllEvents);
router.get('/:id', calendarController.getEventById);
router.post('/', calendarController.createEvent);
router.put('/:id', calendarController.updateEvent);
router.delete('/:id', calendarController.deleteEvent);

module.exports = router;
