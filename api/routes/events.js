const express = require('express');
const router = express.Router();
const db = require('../../config/database');

router.get('/events', async (req, res) => {
  const pool = db.getConnection();
  const [rows] = await pool.execute(
    'SELECT id, title, date, description, location FROM events ORDER BY date ASC'
  );
  res.json(rows);
});

router.get('/events/:id', async (req, res) => {
  const eventId = parseInt(req.params.id);
  
  if (!eventId || eventId <= 0) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  const pool = db.getConnection();
  const [rows] = await pool.execute(
    'SELECT id, title, date, description, location FROM events WHERE id = ?',
    [eventId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.json(rows[0]);
});

router.post('/events', async (req, res) => {
  const pool = db.getConnection();
  
  const [tables] = await pool.execute("SHOW TABLES LIKE 'events'");
  if (tables.length === 0) {
    return res.status(500).json({
      error: 'Database table does not exist',
      message: 'The "events" table was not found. Please check database setup.'
    });
  }

  const { title, date, description, location } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Missing required field: title' });
  }

  if (!date || !date.trim()) {
    return res.status(400).json({ error: 'Missing required field: date' });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({ error: 'Missing required field: description' });
  }

  const [result] = await pool.execute(
    'INSERT INTO events (title, date, description, location) VALUES (?, ?, ?, ?)',
    [title.trim(), date.trim(), description.trim(), location ? location.trim() : '']
  );

  res.json({
    success: true,
    message: 'Event added successfully',
    id: result.insertId
  });
});

module.exports = router;

