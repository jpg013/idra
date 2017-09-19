const express         = require('express');
const UsersController = express.Router();
const queryUsers      = require('../../services/users/queryUsers');
const findUser        = require('../../services/users/findUser');

// ======================================================
// Response Error Messages
// ======================================================
const getErrorResponse = error => {
  switch(error) {
    case 'Bad request data.':
      return {
        status: 400,
        error
      };
    default:
      return {
        status: 500,
        error
      };
  }
};

const responseHandler = (req, res) => {
  if (req.error) {
    const {status, error} = getErrorResponse(req.error);
    res.status(status).send({error});
  } else {
    const {results} = req;
    res.status(200).send({results});
  }
};

// ======================================================
// Controller Methods
// ======================================================
const getUserByUsername = (req, res, next) => {
  const { username } = req.query;
  
  if (!username) {
    req.error = 'Bad request data.';
    return next();
  }
  
  findUser(username, (err, user) => {
    if (err) {
      req.error = err;
      return next();
    }

    req.results = user;
    next();
  });
};

const getUsers = (req, res, next) => {
  const $query = {};
  
  queryUsers($query, {}, (err, results) => {
    if (err) {
      req.error = err;
    } else {
      req.results = results;
    }
    next();
  });
};

/**
 * Controller Routes
 */
UsersController.get('/username', getUserByUsername, responseHandler);
UsersController.get('/', getUsers, responseHandler);

module.exports = UsersController;
