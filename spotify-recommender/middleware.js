const cookieParser = require('cookie-parser');
const passport = require('passport');

module.exports = {
  cookieParserMiddleware: cookieParser(),
  passportInitialize: passport.initialize(),
  passportSession: passport.session(),
  checkAuthMiddleware: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
};
