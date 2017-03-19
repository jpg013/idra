const jwt       = require('jsonwebtoken');
const User = require('../models/user.model');

const getRequestBearerToken = headers => {
  let bearerToken = headers['authorization'];
  if (!bearerToken) return;
  return bearerToken .split(" ")[1];
}

const isAdmin = (req, res, next) => {
  User.findOne({_id: req.authTokenData._id}, function(err, userModel) {
    if (err) throw err;
    
    if (!userModel) {
      return res.status(401).send({
        success: false,
        message: 'User does not exists'
      })
    }
      
    if (!userModel.isAdmin) {
      return res.status(403).send({
        success: false,
        message: 'User does not have admin privileges.'
      })
    }

    req.adminUser = userModel;
    next();
  });
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
    req.authTokenData = authToken._doc;
    next();
  });
}

module.exports = {
  isAuthenticated,
  isAdmin
};