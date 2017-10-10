const express           = require('express');
const makeAuthCodeUrl   = require('../services/makeAuthCodeUrl');
const makeAuthCodeToken = require('../services/makeAuthCodeToken');

// ======================================================
// Define Express Controller
// ======================================================
const apiController = express.Router();

// ======================================================
// Response Handlers
// ======================================================
const defaultResponse = { success: true };

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
    const results = req.results || defaultResponse;
    res.status(200).send(results);
  }
};

// ======================================================
// Controller Methods
// ======================================================

const getAuthUrl = (req, res, next) => {
  const {
    blackbaudClientId,
    blackbaudClientSecret,
    state
  } = req.query;

  if (blackbaudClientId || !blackbaudClientSecret || !state) {
    req.error = 'Bad request data.';
    return next();
  }

  const auth_url = makeAuthCodeUrl(blackbaudClientId, blackbaudClientSecret, state);
  req.results = { auth_url };
  next();
}

const getAuthTicket = (req, res, next) => {
  const {
    code,
    blackbaudClientId,
    blackbaudClientSecret
  } = req.query;

  if (!code || !blackbaudClientId || !blackbaudClientSecret) {
    req.error = 'Bad request data.';
    return next();
  }

  makeAuthCodeToken(code, blackbaudClientId, blackbaudClientSecret, (err, ticket) => {
    if (err) {
      req.error = err;
      return next();
    }

    if (!ticket) {
      req.error = 'Error getting authentication ticket.';
      return next();
    }

    req.results = { ticket }
    next();
  });
}

apiController.get('/auth/url', getAuthUrl, responseHandler);
apiController.get('/auth/ticket', getAuthTicket, responseHandler);
module.exports = apiController;
