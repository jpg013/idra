const express           = require('express');
const reportsController = require('../controllers/reports.controller');
const teamsController   = require('../controllers/teams.controller');
const usersController   = require('../controllers/users.controller');
const setupController   = require('../controllers/setup.controller');

const config = app => {
  const apiRouter = express.Router();

  /**
   * Mount the controllers to routes
   */
  apiRouter.use('/teams', teamsController);
  apiRouter.use('/users', usersController);
  apiRouter.use('/reports', reportsController);
  apiRouter.use('/setup', setupController);

  app.use('/api', apiRouter);
}

module.exports = {
  config
};