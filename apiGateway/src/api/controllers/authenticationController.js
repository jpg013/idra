const express                 = require('express');
const authenticateUser        = require('../../services/authentication/authenticateUser');
const ensureUserAuthenticated = require('../../services/authentication/ensureUserAuthenticated');

// ======================================================
// Define Express Controller
// ======================================================
const authenticationController = express.Router();

// ======================================================
// Response Handlers
// ======================================================
const getErrorResponse = error => {
  switch(error) {
    default:
      return {
        status: 500,
        error
      };
  }
};

const responseHandler = (req, res) => {
  if (req.error) {
    const {status, err} = getErrorResponse(req.error);
    
    res.status(status).send({err});
  } else {
    const {results} = req;
    
    res.status(200).send({results});
  }
};

const postSignIn = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    req.errror = 'Invalid username or password.';
    return next();
  }

  authenticateUser(username, password, (err, results={}) => {
    if (err) {
      req.error = err;
      return next();
    }
    req.results = results;
    next();
  })
};

const getAuthenticatedUser = (req, res, next) => {
  const { user } = req;
  
  if (!user) {
    req.results = {
      success: false,
    };
  } else {
    req.results = {
      success: true,
      user
    }
  }
  next();
};

authenticationController.post('/', postSignIn, responseHandler);
authenticationController.get('/user', ensureUserAuthenticated, getAuthenticatedUser, responseHandler);
module.exports = authenticationController;
