const express                   = require('express');
const async                     = require('async');
const getServiceRoutesforURL    = require('../../services/getServiceRoutesForURL');
const callServiceRouteEndpoints = require('../../services/callServiceRouteEndpoints');

// ======================================================
// Define Express Controller
// ======================================================
const gatewayController = express.Router();

// ======================================================
// Response Handlers
// ======================================================
const getErrorResponse = error => {
  switch(error) {
    case 'Bad request data.':
      return {
        status: 400,
        error
      };
    default:
      return {
        status: 500,
        error
      };
  }
};

const responseHandler = (req, res) => {
  if (req.error) {
    const {status, err} = getErrorResponse(req.error);
    res.status(status).send({err});
  } else {
    const {results} = req;
    res.status(200).send({results});
  }
};

// ======================================================
// Controller Methods
// ======================================================
const gatewayGetHandler = (req, res, next) => {
  const { url, query, body } = req;

  return res.status(200).send({'hello': 'there'});
  
  getServiceRoutesforURL(url, 'http-get', (err, serviceRoutes) => {
    if (err) {
      req.error = err;
      return next();
    }
    req.serviceRoutes = serviceRoutes;
    next();
  });
};

const handleProxyPass = (req, res, next) => {
  if (!req.serviceRoutes) {
    return next();
  }
  const callOptions = {
    queryParams: req.query,
    json: req.body
  };
  
  const proxyEndpoint = (serviceRoute, next) => {
    callServiceRouteEndpoints(serviceRoute, callOptions, next);
  };
  
  async.each(req.serviceRoutes, proxyEndpoint, err => {
    
  });
};

gatewayController.get('/*', gatewayGetHandler, handleProxyPass, responseHandler);

module.exports = gatewayController;
