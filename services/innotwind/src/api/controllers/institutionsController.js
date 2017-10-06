const express               = require('express');
const findInstitution       = require('../../services/institutions/findInstitution');
const findInstitutionById   = require('../../services/institutions/findInstitutionById');
const queryInstitutions     = require('../../services/institutions/queryInstitutions');
const addInstitution        = require('../../services/institutions/addInstitution');
const getAuthUrl            = require('../../services/blackbaud/getAuthUrl');
const getAuthTicket         = require('../../services/blackbaud/getAuthTicket');
const saveTicket            = require('../../services/blackbaud/saveTicket');
const decrypt               = require('../../helpers/decrypt');

// ======================================================
// Define Express Controller
// ======================================================
const institutionsController = express.Router();

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

const getInstitutionList = (req, res, next) => {
  const $query = {};

  queryInstitutions($query, (err, results) => {
    if (err) {
      req.error = err;
      return next();
    }
    req.results = { institutions: results };
    next();
  });
};

const postInstitution = (req, res, next) => {
  const { 
    name, 
    neo4jConnection, 
    neo4jAuth, 
    blackbaudClientId, 
    blackbaudClientSecret ,
    blackbaudSubscriptionKey
  } = req.body;
  
  if (!name || !neo4jConnection || !neo4jAuth || !blackbaudClientId || 
      !blackbaudClientSecret || !blackbaudSubscriptionKey) {
    req.error = 'Bad request.';
    return next();
  }

  const institutionData = { 
    name, 
    neo4jConnection, 
    neo4jAuth, 
    blackbaudClientId, 
    blackbaudClientSecret,
    blackbaudSubscriptionKey
  };

  addInstitution(institutionData, err => {
    if (err) {
      req.error = err;
      return next();
    }
    return next();
  });
};

const getInstitutionDetails = (req, res, next) => {
  const { id } = req.query;
  
  if (!id) {
    req.error = 'Bad query data.';
    return next();
  }

  findInstitutionById(id, (err, results) => {
    if (err) {
      req.error = err;
    } else {
      req.results = { institutionDetails: results };
    }
    next();
  })
}

const getInstitutionAuth = (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    req.error = 'Bad request.';
    return next();
  }

  findInstitutionById(id, (err, institution) => {
    if (err) {
      req.error = err;
      return next();
    }

    const { blackBaudCredentials } = institution;
    
    const auth_uri = getAuthUrl(blackBaudCredentials);
    req.results = { auth_uri };
    next();
  });
}

const postInstitutionAuthCallback = (req, res, next) => {
  const { code, state } = req.body;

  if (!code || !state) {
    req.error = 'Bad request.';
    return next();
  }
  
  const decryptedState = decrypt(state);
  
  findInstitution(decryptedState, (err, institution) => {
    if (err) {
      req.error = err;
      return next();
    }
    
    if (!institution) {
      req.error = 'Bad request.';
      return next();
    }

    getAuthTicket(code, institution.blackBaudCredentials, (ticketErr, ticket) => {
      if (ticketErr) {
        req.error = ticketErr;
        return next();
      }

      if (!ticket) {
        req.error = 'Error authenticating token';
        return next();
      }

      saveTicket(institution.id, ticket, (saveErr, resp) => {
        if (saveErr) {
          req.error = saveErr;
          return next();
        } 
        req.results = { institutionId: institution.id }
        return next();
      });
    });
  });
}

institutionsController.get('/', getInstitutionList, responseHandler);
institutionsController.get('/details', getInstitutionDetails, responseHandler);
institutionsController.get('/auth', getInstitutionAuth, responseHandler);
institutionsController.post('/auth/callback', postInstitutionAuthCallback, responseHandler);
institutionsController.post('/', postInstitution, responseHandler);
module.exports = institutionsController;
