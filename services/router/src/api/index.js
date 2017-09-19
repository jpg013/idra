const express            = require('express');
const registryController = require('./controllers/registryController');
const routerController = require('./controllers/routerController');
const ensureAccessSecret = require('../helpers/ensureAccessSecret');

const config = app => {
  const registryRouter = express.Router();
  const router         = express.Router();

  // ======================================================
  // Mount the controllers to routes
  // ======================================================
  registryRouter.use('/registry', ensureAccessSecret, registryController);
  router.use('/router', ensureAccessSecret, routerController);

  // ======================================================
  // Mount the router to the app
  // ======================================================
  app.use(router);
  app.use(registryRouter);
  return app;
};

module.exports = config;
