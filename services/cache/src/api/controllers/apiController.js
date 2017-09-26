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

const parseResults = results => {
  if (typeof results === 'undefined') {
    return defaultResults;
  }
  if (results === 'OK' || results === 0) {
    return defaultResults
  }
  return JSON.stringify(results);
}

const responseHandler = (req, res) => {
  if (req.error) {
    const {status, err} = getErrorResponse(req.error);
    res.status(status).send({err});
  } else {
    res.status(200).send(parseResults(req.results));
  }
};

const executeCacheCommand = (req, res, next) => {
  const { cacheCommand } = req;

  if (!cacheCommand) {
    req.error = 'Bad request.';
    return next();
  }
  executeCommand(cacheCommand, (err, results) => {
    if (err) {
      req.error = err;
    }
    req.results = results;
    return next();
  });
}

// ======================================================
// Controller Methods
// ======================================================
const setAdd = (req, res, next) => {
  const { key, val } = req.body;
  const { dbIndex } = req;
  const args = {
    commandName: 'sadd',
    key,
    dbIndex,
    val
  };
  req.cacheCommand = makeCacheCommand(args);
  next();  
};

const hashMapSet = (req, res, next) => {
  const { key, val } = req.body;
  const { dbIndex } = req;
  const args = {
    commandName: 'hmset',
    key,
    dbIndex,
    val
  };
  req.cacheCommand = makeCacheCommand(args);
  next();  
};

const setMembers = (req, res, next) => {
  const { key } = req.query;
  const { dbIndex } = req;
  
  if (!key) {
    req.error = 'Bad request.';
    return next();
  }
  
  const args = {
    commandName: 'smembers',
    key,
    dbIndex
  }
  req.cacheCommand = makeCacheCommand(args);
  next();  
};

const hashMapGet = (req, res, next) => {
  const { key } = req.query;
  const { dbIndex } = req;
  
  const args = {
    commandName: 'hgetall',
    key,
    dbIndex
  }
  req.cacheCommand = makeCacheCommand(args);
  next();  
}

// ======================================================
// Attach Handlers
// ======================================================
controller.post('/setadd', setAdd, executeCacheCommand, responseHandler);
controller.post('/hashmapset', hashMapSet, executeCacheCommand, responseHandler);
controller.get('/setmembers', setMembers, executeCacheCommand, responseHandler);
controller.get('/hashmapget', hashMapGet, executeCacheCommand, responseHandler);


module.exports = controller;
