const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login', (req, res, next) => {
  passport.authenticate('spotify', {
    scope: ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state', 'user-read-recently-played', 'user-top-read', 'playlist-read-private', 'playlist-read-collaborative', 'user-library-read', 'user-library-modify'],
  })(req, res, next);
});

router.get('/callback', passport.authenticate('spotify', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/home');
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      res.status(500).send('Error logging out');
    } else {
      res.redirect('/'); // Redirect to the root page after logout
    }
  });
});

module.exports = router;
