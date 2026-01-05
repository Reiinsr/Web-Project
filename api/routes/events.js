const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../../config/database');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(null, false);
  }
});

router.get('/events', async (req, res) => {
  const pool = db.getConnection();
  const [rows] = await pool.execute(
    'SELECT id, title, date, description, location, image FROM events ORDER BY date ASC'
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
    'SELECT id, title, date, description, location, image FROM events WHERE id = ?',
    [eventId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.json(rows[0]);
});

router.post('/events', upload.single('image'), async (req, res) => {
  const { title, date, description, location } = req.body;
  const imageFilename = req.file ? req.file.filename : null;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Missing required field: title' });
  }

  if (!date || !date.trim()) {
    return res.status(400).json({ error: 'Missing required field: date' });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({ error: 'Missing required field: description' });
  }

  const pool = db.getConnection();
  const [result] = await pool.execute(
    'INSERT INTO events (title, date, description, location, image) VALUES (?, ?, ?, ?, ?)',
    [title.trim(), date.trim(), description.trim(), location ? location.trim() : '', imageFilename]
  );

  res.json({
    success: true,
    message: 'Event added successfully',
    id: result.insertId
  });
});

router.put('/events/:id', upload.single('image'), async (req, res) => {
  const eventId = parseInt(req.params.id);
  const { title, date, description, location } = req.body;
  const imageFilename = req.file ? req.file.filename : null;

  if (!eventId || eventId <= 0) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Missing required field: title' });
  }

  if (!date || !date.trim()) {
    return res.status(400).json({ error: 'Missing required field: date' });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({ error: 'Missing required field: description' });
  }

  const pool = db.getConnection();
  
  if (imageFilename) {
    const [oldRows] = await pool.execute('SELECT image FROM events WHERE id = ?', [eventId]);
    if (oldRows.length > 0 && oldRows[0].image) {
      const oldImagePath = path.join(uploadsDir, oldRows[0].image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    await pool.execute(
      'UPDATE events SET title = ?, date = ?, description = ?, location = ?, image = ? WHERE id = ?',
      [title.trim(), date.trim(), description.trim(), location ? location.trim() : '', imageFilename, eventId]
    );
  } else {
    await pool.execute(
      'UPDATE events SET title = ?, date = ?, description = ?, location = ? WHERE id = ?',
      [title.trim(), date.trim(), description.trim(), location ? location.trim() : '', eventId]
    );
  }

  res.json({
    success: true,
    message: 'Event updated successfully'
  });
});

router.delete('/events/:id', async (req, res) => {
  const eventId = parseInt(req.params.id);

  if (!eventId || eventId <= 0) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  const pool = db.getConnection();
  const [rows] = await pool.execute('SELECT image FROM events WHERE id = ?', [eventId]);
  
  if (rows.length > 0 && rows[0].image) {
    const imagePath = path.join(uploadsDir, rows[0].image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  
  await pool.execute('DELETE FROM events WHERE id = ?', [eventId]);

  res.json({
    success: true,
    message: 'Event deleted successfully'
  });
});

module.exports = router;

