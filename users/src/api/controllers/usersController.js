const express    = require('express');
const httpStatus = require('http-status-codes');

const UsersController = userRepository => {
  const controller = express.Router()

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
      res.status(httpStatus.OK).send(results);
    }
  };

  // ======================================================
  // Controller Methods
  // ======================================================
  const getUserByUsername = (req, res, next) => {
    const { userName } = req.query;

    if (!userName) {
      req.error = 'Invalid username.';
      return next();
    }

    userRepository
      .findByUsername(userName)
      .then(user => {
        req.results = { user }
        next()
      })
      .catch(e => {
        req.error = e
        next()
      })
  };

  /**
   * Controller Routes
   */
  controller.get('/username', getUserByUsername, responseHandler);

  return controller;
}

module.exports = UsersController;
