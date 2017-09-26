const express                = require('express');
const async                  = require('async');
const mapOriginToRoutes      = require('../../services/mapOriginToRoutes');
const callRoute              = require('../../services/callRoute');
const urlUtils               = require('url');
const ensureRoutePermissions = require('../../middleware/ensureRoutePermissions')

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
    res.status(200).send(results);
  }
};

const proxyRoutes = (req, res, next) => {
  if (!req.routes) {
    return next();
  }
  
  const { query: queryParams, body: json, user, routes } = req;
  const proxyArgs = {
    queryParams,
    json,
    user
  };
  
  const proxy = (item, next) => callRoute(item, proxyArgs, next);
  async.map(routes, proxy, (err, results) => {
    if (err) {
      req.error = err;
      return next();
    }
    req.results = results;
    next();
  });
};

// ======================================================
// Controller Methods
// ======================================================
const gatewayGetHandler = (req, res, next) => {
  const { url: originUrl } = req;

  mapOriginToRoutes(urlUtils.parse(originUrl).pathname, 'http-get', (err, {routes}) => {
    if (err) {
      req.error = err;
      return next();
    }
    req.routes = routes;
    next();
  });
};

gatewayController.get('/*', gatewayGetHandler, ensureRoutePermissions, proxyRoutes, responseHandler);

module.exports = gatewayController;
