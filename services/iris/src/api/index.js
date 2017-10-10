const express                 = require('express');
const apiController  = require('./apiController');
const ensureAccessSecret      = require('../helpers/ensureAccessSecret');

const config = app => {
  const apiRouter = express.Router();

  apiRouter.use(ensureAccessSecret);
  apiRouter.use('/', apiController);
  app.use(apiRouter);
};

module.exports = config;
