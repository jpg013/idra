const express            = require('express');
const routingController  = require('./controllers/routingController');
const ensureAccessSecret = require('../helpers/ensureAccessSecret');

const config = app => {
  const router = express.Router();

  // ======================================================
  // Mount the controllers to router
  // ======================================================
  router.use('/routing', ensureAccessSecret, routingController);

  // ======================================================
  // Mount the router to the app
  // ======================================================
  app.use(router);
  return app;
};

module.exports = config;
