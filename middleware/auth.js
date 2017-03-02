const jwt       = require('jsonwebtoken');

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

  jwt.verify(token, process.env.AUTH_TOKEN_SECRET, function(err, authToken) {
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