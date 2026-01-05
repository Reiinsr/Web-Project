const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const bcrypt = require('bcrypt');

router.post('/signup', async function(req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin === true || req.body.isAdmin === 'true';
  
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  const pool = db.getConnection();
  const hashedPassword = await bcrypt.hash(password, 10);
  
  pool.execute(
    'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)',
    [username.trim(), email.trim(), hashedPassword, isAdmin ? 1 : 0]
  ).then(function([result]) {
    req.session.userId = result.insertId;
    req.session.username = username.trim();
    req.session.isAdmin = isAdmin;
    res.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: result.insertId,
        username: username.trim(),
        isAdmin: isAdmin
      }
    });
  }).catch(function(err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

router.post('/login', async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  const pool = db.getConnection();
  const [rows] = await pool.execute(
    'SELECT id, username, email, password, is_admin FROM users WHERE username = ? OR email = ?',
    [username.trim(), username.trim()]
  );
  
  if (rows.length === 0) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  
  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  
  if (!match) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  
  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.isAdmin = user.is_admin === 1;
  
  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
      isAdmin: user.is_admin === 1
    }
  });
});

router.post('/logout', function(req, res) {
  req.session.destroy(function() {
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

router.get('/me', function(req, res) {
  if (req.session.userId) {
    res.json({
      success: true,
      user: {
        id: req.session.userId,
        username: req.session.username,
        isAdmin: req.session.isAdmin
      }
    });
  } else {
    res.json({ success: false, user: null });
  }
});

module.exports = router;

