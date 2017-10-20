const express            = require('express');
const usersController    = require('./controllers/usersController');
const ensureAccessSecret = require('../helpers/ensureAccessSecret');

const config = (app, userRepository) => {
  const apiRouter = express.Router();

  // ======================================================
  // Mount the controllers to routes
  // ======================================================
  apiRouter.use('/users', /*ensureAccessSecret,*/ usersController(userRepository));

  // ======================================================
  // Mount the router to the app and return app
  // ======================================================
  app.use(apiRouter);
  return app;
};

module.exports = config;
