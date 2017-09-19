const express                   = require('express');
const gatewayController         = require('./controllers/gatewayController');
const authenticationController  = require('./controllers/authenticationController');
const populateAuthenticatedUser = require('../services/authentication/populateAuthenticatedUser');
const logGatewayRequest         = require('../services/logging/logGatewayRequest');
const parseRequestBearerToken   = require('../services/authentication/parseRequestBearerToken');

const config = app => {
  const gatewayRouter = express.Router();

  gatewayRouter.use(parseRequestBearerToken);
  gatewayRouter.use(populateAuthenticatedUser);
  gatewayRouter.use(logGatewayRequest);
  gatewayRouter.use('/authentication', authenticationController);
  gatewayRouter.use('/', gatewayController);

  app.use('/api', gatewayRouter);
};

module.exports = config;
