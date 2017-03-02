const loginController    = require('./controllers/login.controller');
const express            = require('express');

const config = app => {
  const publicRouter = express.Router();
  publicRouter.use('/', loginController);
  app.use('/', publicRouter);
}

module.exports = {
  config
}