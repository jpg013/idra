const jwt       = require('jsonwebtoken');
const request   = require('request');
const async     = require('async');
const crypto    = require('../crypto');

const getRequestBearerToken = headers => {
  return headers['authorization'];
};

const ensureInnosolAuthenticated = (req, res, next) => {
  const authToken = getRequestBearerToken();
  if (!authToken) {
    req.error = 'Bad authentication token.';
    return next();
  }
  
  jwt.verify(token, process.env.AUTH_TOKEN_SECRET, function(err, authTokenPayload) {
    if (err || !authToken) {
      req.error = 'Bad authentication token.';
      return next();
    }
    
    const options = {
      method: 'GET',
      uri: `http://localhost:8001/users?id=${authTokenPayload.id}`,
      json: true
    };
    
    request(options, (err, resp, body) => {
    
    });
  });
};

const isAdmin = (req, res, next) => {
  User.findOne({_id: req.authTokenData.id}, function(err, userModel) {
    if (err) throw err;
    
    if (!userModel) {
      return res.status(401).send({
        success: false,
        message: 'User does not exists'
      });
    }
      
    if (!userModel.isAdmin) {
      return res.status(403).send({
        success: false,
        message: 'User does not have admin privileges.'
      });
    }
    req.adminUser = userModel;
    next();
  });
};

const populateUser = (req, res, next) => {
  User.findOne({_id: req.authTokenData.id}, (err, userModel) => {
    if (!userModel) {
      return res.status(401).send({
        success: false,
        message: 'User does not exists'
      });
    }
    req.user = userModel;
    next();
  });
};

const ensureUserAuthenticated = (req, res, next) => {
  const token = getRequestBearerToken(req.headers);
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

module.exports.ensureUserAuthenticated = ensureUserAuthenticated;

module.exports = {
  isAuthenticated,
  isAdmin
};
