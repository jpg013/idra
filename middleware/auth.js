const jwt       = require('jsonwebtoken');
const config    = require('../config');

const getRequestBearerToken = headers => {
  let bearerToken = headers['authorization'];
  if (!bearerToken) return;
  return bearerToken .split(" ")[1];
}

const isAuthenticated = (req, res, next) => {
  const token = getRequestBearerToken(req.headers);
  if (!token) {
    return res.status(401).send({
      success: false,
      message: 'No token provided'
    });
  }

  jwt.verify(token, config.authTokenSecret, function(err, authToken) {
    if (err) {
      return res.status(401).send({
        success: false,
        message: 'Bad token'
      });
    }
    req.authTokenUser = authToken._doc;
    return next();
  });
}

exports.isAuthenticated = isAuthenticated;