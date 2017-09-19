const express                = require('express');
const institutionsController = require('./controllers/institutionsController');
const ensureAccessSecret     = require('../helpers/ensureAccessSecret');

const config = app => {
  const institutionsRouter = express.Router();

  app.use('/institutions', institutionsController);
};

module.exports = config;