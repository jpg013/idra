const express        = require('express');
const executeCommand = require('../../cache/executeCommand');
const makeCacheCommand    = require('../../commands/makeCacheCommand');

// ======================================================
// Define Express Controller
// ======================================================
const controller = express.Router();

const defaultResults = { success: true }

// ======================================================
// Response Handlers
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
    const {status, err} = getErrorResponse(req.error);
    res.status(status).send({err});
  } else {
    const results = req.results || defaultResults;
    res.status(200).send(results);
  }
};

// ======================================================
// Controller Methods
// ======================================================
const setAdd = (req, res, next) => {
  const { key, val } = req.body;
  const { dbIndex } = req;
  const cacheCommand = makeCacheCommand('sadd', key, val, dbIndex);

  if (!cacheCommand) {
    req.error = 'Bad request.';
    return next();
  }

  executeCommand(cacheCommand, err => {
    if (err) {
      req.error = err;
    }
    return next();
  });
}

const hashMapSet = (req, res, next) => {
  const { key, val } = req.body;
  const { dbIndex } = req;
  const cacheCommand = makeCacheCommand('hmset', key, val, dbIndex);

  if (!cacheCommand) {
    req.error = 'Bad request.';
    return next();
  }

  executeCommand(cacheCommand, err => {
    if (err) {
      req.error = err;
    }
    return next();
  });
}

// ======================================================
// Attach Handlers
// ======================================================
controller.post('/sadd', setAdd, responseHandler);
//controller.post('/set', set, responseHandler);
controller.post('/hmset', hashMapSet, responseHandler);
//controller.get('/setmembers', setMembers, responseHandler);

module.exports = controller;
