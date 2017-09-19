const jwt = require('jsonwebtoken');

const parseRequestBearerToken = (req, res, next) => {
  const requestBearer = req.headers['authorization'];
  
  if (!requestBearer) {
    return next();
  }

  const tokens = requestBearer.split(/\s/g);
  
  if (!tokens || tokens.length !== 2) {
    return next();
  }
  
  const bearerToken = tokens[1];
  
  jwt.verify(bearerToken, process.env.CRYPTO_KEY, function(err, decryptedBearerToken) {
    if (err) {
      return next();
    }
    req.bearerToken = decryptedBearerToken;
    next();
  });
};

module.exports = parseRequestBearerToken;
