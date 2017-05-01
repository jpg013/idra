const express               = require('express');
const ReportsController     = require('../controllers/reports.controller');
const TeamsController       = require('../controllers/teams.controller');
const UsersController       = require('../controllers/users.controller');
const AuthController        = require('../controllers/auth.controller');
const ProfileController     = require('../controllers/profile.controller');
const TeamProfileController = require('../controllers/team-profile.controller');
const AuthMiddleware    = require('../middleware/auth');

const config = app => {
  const apiRouter = express.Router();

  /**
   * Mount the controllers to routes
   */
  apiRouter.use('/teams', AuthMiddleware.isAuthenticated, TeamsController);
  apiRouter.use('/users', AuthMiddleware.isAuthenticated, UsersController);
  apiRouter.use('/reports', AuthMiddleware.isAuthenticated, ReportsController);
  apiRouter.use('/profile', AuthMiddleware.isAuthenticated, ProfileController);
  apiRouter.use('/teamprofile', AuthMiddleware.isAuthenticated, TeamProfileController);
  apiRouter.use('/', AuthController);

  /**
   *  Mount the router to the app
   */
  app.use('/api', apiRouter);
}

module.exports = {
  config
};