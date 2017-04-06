const express           = require('express');
const reportsController = require('../controllers/reports.controller');
const teamsController   = require('../controllers/teams.controller');
const usersController   = require('../controllers/users.controller');
const loginController   = require('../controllers/login.controller');
const authMiddleware    = require('../middleware/auth');

const config = app => {
  const apiRouter = express.Router();

  /**
   * Mount the controllers to routes
   */
  apiRouter.use('/teams', authMiddleware.isAuthenticated, teamsController);
  apiRouter.use('/users', authMiddleware.isAuthenticated, usersController);
  apiRouter.use('/reports', authMiddleware.isAuthenticated, reportsController);
  apiRouter.use('/', loginController);

  /**
   *  Mount the router to the app
   */
  app.use('/api', apiRouter);
}

module.exports = {
  config
};