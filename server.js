const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/database');
const eventsRoutes = require('./api/routes/events');
const messagesRoutes = require('./api/routes/messages');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', eventsRoutes);
app.use('/api', messagesRoutes);

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

