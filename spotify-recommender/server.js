require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const { cookieParserMiddleware, passportInitialize, passportSession, checkAuthMiddleware } = require('./middleware');
const authRoutes = require('./routes/authRoutes');
const spotifyRoutes = require('./routes/spotifyRoutes');
require('./passport-config');

// Initialize express app
const app = express();
const port = require('./config').port;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParserMiddleware);
app.use(session({
  secret: 'your secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passportInitialize);
app.use(passportSession);
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Use routes
app.use(authRoutes);
app.use(spotifyRoutes);

// Home route
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/home.html'));
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/home.html')); // Serve the same content as /home
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
