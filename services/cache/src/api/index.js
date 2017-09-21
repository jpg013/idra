const express            = require('express');
const apiController      = require('./controllers/apiController');
const ensureAccessSecret = require('../middleware/ensureAccessSecret');
const setDbIndex         = require('../middleware/setDbIndex');

const config = app => {
  const apiRouter = express.Router();

  // ======================================================
  // Mount the controllers to routes
  // ======================================================
  apiRouter.use(ensureAccessSecret, setDbIndex, apiController);

  // ======================================================
  // Mount the router to the app
  // ======================================================
  app.use(apiRouter);
  return app;
};

module.exports = config;
