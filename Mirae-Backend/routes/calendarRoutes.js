const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/sync-dashboard-reminders', calendarController.syncDashboardReminders);
router.get('/', calendarController.getAllEvents);
router.get('/:id', calendarController.getEventById);
router.post('/', calendarController.createEvent);
router.put('/:id', calendarController.updateEvent);
router.delete('/:id', calendarController.deleteEvent);

module.exports = router;
