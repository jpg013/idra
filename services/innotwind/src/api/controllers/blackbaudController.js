const express         = require('express');
const getByName       = require('../../services/institutions/getByName');
const getById         = require('../../services/institutions/getById');
const makeAuthUrl     = require('../../services/blackbaud/makeAuthUrl');
const makeAuthTicket  = require('../../services/blackbaud/makeAuthTicket');
const saveAuthTicket  = require('../../services/institutions/saveBlackbaudTicket');
const decrypt         = require('../../helpers/decrypt');

// ======================================================
// Define Express Controller
// ======================================================
const blackbaudController = express.Router();

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

const getBlackbaudAuthUrl = (req, res, next) => {
  const { institutionId } = req.query;

  if (!institutionId) {
    req.error = 'Bad request data.';
    return next();
  }

  getById(institutionId, (err, institution) => {
    if (err) {
      req.error = err;
      return next();
    }

    if (!institution) {
      req.error = 'Bad request data.';
      return next();
    }

    const {
      clientId,
      clientSecret,
      state
    } = institution.blackBaudCredentials;

    req.results = { authUrl: makeAuthUrl(clientId, clientSecret, state) }
    next();
  });
}

const postBlackbaudAuthCode = (req, res, next) => {
  const { code, state } = req.body;
  if (!code || !state) {
    req.error = 'Bad request data.';
    return next();
  }

  const institutionName = decrypt(state);
  
  getByName(institutionName, (err, institution) => {
    if (err) {
      req.error = err;
      return next();
    }

    if (!institution) {
      req.error = 'Bad request data.';
      return next();
    }

    const { 
      clientId, 
      clientSecret, 
    } = institution.blackBaudCredentials

    makeAuthTicket(code, clientId, clientSecret, (ticketErr, ticket) => {
      if (ticketErr) {
        req.error = ticketErr;
        return next();
      }

      if (!ticket) {
        req.error = 'Error authenticating token';
        return next();
      }

      saveAuthTicket(institution.id, ticket, (saveErr, resp) => {
        if (saveErr) {
          req.error = saveErr;
          return next();
        }
        req.results = { success: true }
        return next();
      });
    });
  });
}

blackbaudController.get('/auth/url', getBlackbaudAuthUrl, responseHandler);
blackbaudController.post('/auth/code', postBlackbaudAuthCode, responseHandler);
module.exports = blackbaudController;
