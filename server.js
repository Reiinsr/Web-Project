const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const db = require('./config/database');
const eventsRoutes = require('./api/routes/events');
const messagesRoutes = require('./api/routes/messages');
const authRoutes = require('./api/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use('/api', eventsRoutes);
app.use('/api', messagesRoutes);
app.use('/api/auth', authRoutes);

app.get('/init-db', function(req, res) {
  const password = req.query.password;
  if (password !== 'danny123') {
    return res.status(401).send('Unauthorized');
  }
  
  db.initialize().then(function() {
    res.send('Database initialized successfully!');
  });
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

db.initialize().then(() => {
  app.listen(PORT);
});

