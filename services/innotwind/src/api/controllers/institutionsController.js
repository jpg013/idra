const express           = require('express');
const getById           = require('../../services/institutions/getById');
const getList           = require('../../services/institutions/getList');
const createInstitution = require('../../services/institutions/createInstitution');

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

const getInstitutions = (req, res, next) => {
  getList((err, results) => {
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

  if (!name || !neo4jConnection || !neo4jAuth || !blackbaudClientId || !blackbaudClientSecret || !blackbaudSubscriptionKey) {
    req.error = 'Bad request data.';
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

  createInstitution(institutionData, err => {
    if (err) {
      req.error = err;
    }

    return next();
  });
};

const getInstitutionDetails = (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    req.error = 'Bad request data.';
    return next();
  }

  getById(id, (err, results) => {
    if (err) {
      req.error = err;
    } else {
      req.results = { institutionDetails: results };
    }
    next();
  })
}

institutionsController.get('/', getInstitutions, responseHandler);
institutionsController.get('/details', getInstitutionDetails, responseHandler);
institutionsController.post('/', postInstitution, responseHandler);
module.exports = institutionsController;
