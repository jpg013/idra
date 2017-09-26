const express        = require('express');
const registerRoutes = require('../../services/registerRoutes');
const lookupRoutes   = require('../../services/cache/lookupRoutes');

// ======================================================
// Define Express Controller
// ======================================================
const routerController = express.Router();

const defaultSuccessResponse = { success: true };

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
    const results = req.results || defaultSuccessResponse;
    res.status(200).send(results);
  }
};

// ======================================================
// Controller Methods
// ======================================================
const getRoutes = (req, res, next) => {
  const { url, protocol } = req.query;
  
  if (!url || !protocol) {
    req.error = 'Bad request data.';
    return next();
  }

  lookupRoutes(url, protocol, (err, routes) => {
    if (err) {
      req.error = err;
      return next();
    }
    req.results = { routes };
    next();
  });
};

const postRoutes = (req, res, next) => {
  const { containerName, containerPort, endpoints } = req.body;
  
  if (!containerName || !containerPort || !endpoints) {
    req.error = 'Bad request data.';
    return next();
  }

  const routingData = {
    containerName,
    containerPort,
    endpoints
  };

  registerRoutes(routingData, err => {
    if (err) {
      req.error = err;
    } 
    next();
  });
};

// ======================================================
// Attach Handlers
// ======================================================
routerController.get('/', getRoutes, responseHandler);
routerController.post('/', postRoutes, responseHandler);

module.exports = routerController;
