const jwt       = require('jsonwebtoken');
const User = require('../models/userModel');

const getRequestBearerToken = headers => {
  return headers['authorization'];
}

const isAdmin = (req, res, next) => {
  User.findOne({_id: req.authTokenData.id}, function(err, userModel) {
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

const populateUser = (req, res, next) => {
  User.findOne({_id: req.authTokenData.id}, (err, userModel) => {
    if (!userModel) {
      return res.status(401).send({
        success: false,
        message: 'User does not exists'
      })
    }
    req.user = userModel;
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
    req.authTokenData = authToken;
    next();
  });
}

module.exports = {
  isAuthenticated,
  isAdmin,
  populateUser
};
