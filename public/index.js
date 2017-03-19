const express         = require('express');
const loginController = require('../controllers/login.controller');

const config = app => {
  const publicRouter = express.Router();

  publicRouter.use('/', loginController);

  /**
   * Mount the public router
   */
  
  app.use('/', publicRouter);
}

module.exports = {
  config
};
