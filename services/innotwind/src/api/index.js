const express                    = require('express');
const institutionsController     = require('./controllers/institutionsController');
const blackbaudController        = require('./controllers/blackbaudController');
const alumniImportJobsController = require('./controllers/alumniImportJobsController');
const ensureAccessSecret         = require('../helpers/ensureAccessSecret');

const config = app => {
  const institutionsRouter  = express.Router();
  const blackbaudRouter = express.Router();
  const alumniImportJobsRouter = express.Router();

  institutionsRouter.use('/institutions', institutionsController);
  blackbaudRouter.use('/blackbaud', blackbaudController);
  alumniImportJobsRouter.use('/alumniimportjobs', alumniImportJobsController);

  app.use(ensureAccessSecret);
  app.use(institutionsRouter);
  app.use(alumniImportJobsRouter);
  app.use(blackbaudRouter);
};

module.exports = config;
