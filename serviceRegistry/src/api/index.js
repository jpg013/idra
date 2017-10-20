const express            = require('express')
const apiController      = require('./controllers/apiController')
const ensureAccessSecret = require('../helpers/ensureAccessSecret')

const config = (app, serviceRepository) => {
  const apiRouter = express.Router();

  // ======================================================
  // Mount the controllers to routes
  // ======================================================
  apiRouter.use('/', /*ensureAccessSecret,*/ apiController(serviceRepository));

  // ======================================================
  // Mount the router to the app and return app
  // ======================================================
  app.use(apiRouter);
  return app;
};

module.exports = config;
