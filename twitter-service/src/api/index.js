const express            = require('express')
const apiController      = require('./controllers/apiController')

const config = (app, container) => {
  const apiRouter = express.Router();

  // ======================================================
  // Mount the controllers to routes
  // ======================================================
  apiRouter.use('/', apiController(container));

  // ======================================================
  // Mount the router to the app and return app
  // ======================================================
  app.use(apiRouter);
  return app;
};

module.exports = config;
