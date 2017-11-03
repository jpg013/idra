const express                = require('express');
const institutionsController = require('./controllers/usersController');

const config = (app, container) => {
  const { repositories } = container.cradle
  
  if (!repositories) {
    return reject(new Error('The server must be started with a connected repository'))
  }
  
  const apiRouter = express.Router();

  // ======================================================
  // Mount the controllers to routes
  // ======================================================
  apiRouter.use('/institutions', institutionsController(repositories));

  // ======================================================
  // Mount the router to the app and return app
  // ======================================================
  app.use(apiRouter);
  return app;
};

module.exports = config;
