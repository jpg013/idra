const express           = require('express');
const findInstitution   = require('../../services/institutions/findInstitution');
const queryInstitutions = require('../../services/institutions/queryInstitutions');

// ======================================================
// Define Express Controller
// ======================================================
const institutionsController = express.Router();

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
    res.status(200).send(results);
  }
};

// ======================================================
// Controller Methods
// ======================================================

const getInstitutions = (req, res, next) => {
  const $query = {};

  queryInstitutions($query, (err, results) => {
    if (err) {
      req.error = err;
      return next();
    }
    req.results = results;
    next();
  });
};

institutionsController.get('/', getInstitutions, responseHandler);
module.exports = institutionsController;
