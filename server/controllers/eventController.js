const Event = require('../models/Event');
const Booking = require('../models/Booking');
const sequelize = require('../config/db');
const { Transaction } = require('sequelize');

// GET /api/events — All users can view
const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ order: [['date', 'ASC']] });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/events — Admin only
const createEvent = async (req, res) => {
  const { title, date, total_tickets } = req.body;
  try {
    const event = await Event.create({ title, date, total_tickets, available_tickets: total_tickets });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/events/:id — Admin only
const updateEvent = async (req, res) => {
  const { title, date, total_tickets } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const event = await Event.findByPk(req.params.id, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!event) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Event not found' });
    }

    const ticketDiff = total_tickets - event.total_tickets;
    const newAvailable = Math.max(0, event.available_tickets + ticketDiff);

    await event.update(
      { title, date, total_tickets, available_tickets: newAvailable },
      { transaction }
    );

    await transaction.commit();
    res.json(event);
  } catch (err) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/events/:id — Admin only
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/events/:id/book — User only
const bookEvent = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // 1. Fetch the event with a row-level lock (FOR UPDATE)
    const event = await Event.findByPk(req.params.id, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!event) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Event not found' });
    }

    // 2. Check current availability
    const quantity = parseInt(req.body.quantity) || 1;
    if (event.available_tickets < quantity) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: `Sorry, only ${event.available_tickets} tickets left!` 
      });
    }

    // 3. Update tickets and create booking atomicity
    await event.update(
      { available_tickets: event.available_tickets - quantity },
      { transaction }
    );

    // Create a single booking record for the requested quantity
    const booking = await Booking.create(
      { userId: req.user.id, eventId: event.id, quantity }, // Added quantity field to model (will update next)
      { transaction }
    );

    // Commit the changes
    await transaction.commit();

    res.status(201).json({ message: 'Booking confirmed!', booking, event });
  } catch (err) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ message: err.message });
  }
};

// GET /api/events/my-bookings — Get current user's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [{ model: Event }],
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent, bookEvent, getMyBookings };
