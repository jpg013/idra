const jwt = require('jsonwebtoken');

const ensureUserAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).send({
      success: false,
      message: 'No authentication token provided.'
    });
  }

  jwt.verify(token, process.env.AUTH_TOKEN_SECRET, function(err, authTokenPayload) {
    if (err) {
      return res.status(401).send({
        success: false,
        message: 'Bad authentication token.'
      });
    }
    req.authTokenPayload = authTokenPayload;
    next();
  });
};

module.exports = ensureUserAuthenticated;
