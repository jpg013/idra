const express            = require('express');
const usersController     = require('./controllers/usersController');
const ensureAccessSecret = require('../helpers/ensureAccessSecret');

const config = app => {
  const apiRouter = express.Router();

  // ======================================================
  // Mount the controllers to routes
  // ======================================================
  apiRouter.use('/users', /*ensureAccessSecret,*/ usersController);

  // ======================================================
  // Mount the router to the app and retur app
  // ======================================================
  app.use(apiRouter);
  return app;
};

module.exports = config;
