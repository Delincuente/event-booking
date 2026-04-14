const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  bookEvent,
  getMyBookings,
} = require('../controllers/eventController');

// Public — any logged in user
router.get('/', protect, getEvents);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getEventById);

// Admin only
router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

// User: book a ticket
router.post('/:id/book', protect, bookEvent);

module.exports = router;
