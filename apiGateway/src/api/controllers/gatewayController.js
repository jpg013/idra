const express                = require('express');
const async                  = require('async');
const mapOriginToRoutes      = require('../../services/mapOriginToRoutes');
const proxyEndpoint          = require('../../services/proxyEndpoint');
const urlUtils               = require('url');
const ensureRoutePermissions = require('../../middleware/ensureRoutePermissions')

// ======================================================
// Define Express Controller
// ======================================================
const gatewayController = express.Router();

// ======================================================
// Response Handlers
// ======================================================
const defaultSuccessResponse = { success: true };

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
    const results = req.results || defaultSuccessResponse;
    res.status(200).send({results});
  }
};

const makeProxyArgs = (req, res, next) => {
  const { url, method } = req;
  
  const args = {
    originUrl: urlUtils.parse(url).pathname,
    protocol: ''
  };

  switch(method) {
    case 'POST':
      args.protocol = 'http-post';
      break;
    case 'GET':
      args.protocol = 'http-get';
      break;
    case 'DELETE':
      args.protocol = 'http-delete';
      break;
    case 'PUT':
      args.protocol = 'http-put';
      break;
  }
  
  req.proxyArgs = args;
  next();
}

const proxy = (req, res, next) => {
  if (!req.routes) {
    return next();
  }
  
  const { query: queryParams, body: json, user, routes } = req;
  
  const args = {
    queryParams,
    json,
    user
  };
  
  const call = (item, next) => proxyEndpoint(item, args, next);
  
  async.map(routes, call, (err, results) => {
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
const mapRoutes = (req, res, next) => {
  const { originUrl, protocol } = req.proxyArgs;

  mapOriginToRoutes(originUrl, protocol, (err, {routes}) => {
    if (err) {
      req.error = err;
      return next();
    }
    req.routes = routes;
    next();
  });
};

gatewayController.post('/*', makeProxyArgs, mapRoutes, ensureRoutePermissions, proxy, responseHandler);
gatewayController.get('/*', makeProxyArgs, mapRoutes, ensureRoutePermissions, proxy, responseHandler);

module.exports = gatewayController;
