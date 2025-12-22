const express = require('express');
const router = express.Router();
const db = require('../../config/database');

router.post('/messages', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Missing required field: name' });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Missing required field: email' });
  }

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Missing required field: message' });
  }

  const pool = db.getConnection();
  const [result] = await pool.execute(
    'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
    [name.trim(), email.trim(), message.trim()]
  );

  res.json({
    success: true,
    message: 'Message sent successfully',
    id: result.insertId
  });
});

module.exports = router;

