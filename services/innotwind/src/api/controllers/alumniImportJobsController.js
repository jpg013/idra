const express                  = require('express');
const createAlumniImportJob    = require('../../services/alumniImportJobs/createAlumniImportJob');
const emitConstituentImportJob = require('../../services/mq/actions/emitConstituentImportJob');

// ======================================================
// Define Express Controller
// ======================================================
const alumniImportJobsController = express.Router();

// ======================================================
// Response Handlers
// ======================================================
const defaultResponse = { success: true };

const getErrorResponse = error => {
  switch(error) {
    default:
      return {
        status: 500,
        msg: error
      };
  }
};

const responseHandler = (req, res) => {
  if (req.error) {
    const {status, msg} = getErrorResponse(req.error);
    res.status(status).send({msg});
  } else {
    const results = req.results || defaultResponse;
    res.status(200).send(results);
  }
};

// ======================================================
// Controller Methods
// ======================================================
const postAlumniImportJob = (req, res, next) => {
  const { institutionId } = req.body;

  if (!institutionId) {
    req.error = 'Bad request data.';
    return next();
  }

  createAlumniImportJob(institutionId, (err, alumniImportJob) => {
    if (err) {
      req.error = err;
      return next();
    }

    // emit job
    emitConstituentImportJob(institutionId);
    
    req.results = { alumniImportJob }
    next();
  });  
};

alumniImportJobsController.post('/', postAlumniImportJob, responseHandler);
module.exports = alumniImportJobsController;
