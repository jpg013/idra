const express                   = require('express');
const gatewayController         = require('./controllers/gatewayController');
const authenticationController  = require('./controllers/authenticationController');
const populateAuthenticatedUser = require('../services/authentication/populateAuthenticatedUser');
const logGatewayRequest         = require('../services/logging/logGatewayRequest');
const parseRequestBearerToken   = require('../services/authentication/parseRequestBearerToken');

const config = app => {
  const apiGatewayRouter = express.Router();

  apiGatewayRouter.use(parseRequestBearerToken);
  apiGatewayRouter.use(populateAuthenticatedUser);
  apiGatewayRouter.use(logGatewayRequest);
  apiGatewayRouter.use('/authentication', authenticationController);
  apiGatewayRouter.use('/', gatewayController); // add ensure user authenticated here
  app.use('/api', apiGatewayRouter);
};

module.exports = config;
