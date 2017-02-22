const jwt       = require('jsonwebtoken');
const config    = require('../config');

const isAuthenticated = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({
      success: false,
      message: 'No token provided'
    });
  }

  jwt.verify(token, config.authTokenSecret, function(err, authToken) {
    if (err) {
      return res.status(403).send({
        success: false,
        message: 'Bad token.'
      });
    }
    req.authToken = authToken;
    return next();
  });
}

exports.isAuthenticated = isAuthenticated;