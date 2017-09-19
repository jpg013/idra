const express = require('express');
const executeCacheCommands = require('../cache/executeCommands');
// ======================================================
// Define Express Controller
// ======================================================
const controller = express.Router();

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
    const {results} = req;
    res.status(200).send({results});
  }
};

// ======================================================
// Controller Methods
// ======================================================
const postCache = (req, res, next) => {
  const commands = req.body;
  executeCacheCommands(commands);
  next();
};

// ======================================================
// Attach Handlers
// ======================================================
controller.post('/cache', postCache, responseHandler);

module.exports = controller;
