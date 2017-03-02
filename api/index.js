const reportController  = require('./controllers/report.controller');
const setupController   = require('./controllers/setup.controller');
const subjectController = require('./controllers/subject.controller');
const teamController    = require('./controllers/team.controller');
const userController    = require('./controllers/user.controller');
const express           = require('express');

const config = app => {
  const apiRouter = express.Router();
  apiRouter.use('/team', teamController);
  apiRouter.use('/user', userController);
  apiRouter.use('/subject', subjectController);
  apiRouter.use('/setup', setupController);
  apiRouter.use('/report', reportController);
  app.use('/api', apiRouter);
}

module.exports = {
  config
}