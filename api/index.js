const express               = require('express');
const ReportsController     = require('../controllers/reportController');
const TeamsController       = require('../controllers/teamController');
const UsersController       = require('../controllers/userController');
const AuthController        = require('../controllers/authController');
const UserProfileController     = require('../controllers/userProfileController');
const TeamProfileController = require('../controllers/teamProfileController');
const AuthMiddleware    = require('../middleware/auth');

const config = app => {
  const apiRouter = express.Router();

  /**
   * Mount the controllers to routes
   */
  apiRouter.use('/teams', AuthMiddleware.isAuthenticated, TeamsController);
  apiRouter.use('/users', AuthMiddleware.isAuthenticated, UsersController);
  apiRouter.use('/reports', AuthMiddleware.isAuthenticated, ReportsController);
  apiRouter.use('/userprofile', AuthMiddleware.isAuthenticated, UserProfileController);
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
