const express                 = require('express');
const register                = require('../../services/register');
const unregister              = require('../../services/unregister');
const persistRegistryToCache  = require('../../registryCache/persistRegistryToCache');
const removeRegistryFromCache = require('../../registryCache/removeRegistryFromCache');

// ======================================================
// Define Express Controller
// ======================================================
const registryController = express.Router();

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
const postApiRegistry = (req, res, next) => {
  const { containerName, containerPort, apiRoutes } = req.body;
  
  if (!containerName || !containerPort || !apiRoutes) {
    req.error = 'Bad request data.';
    return next();
  }

  const registryData = {
    containerName,
    containerPort,
    apiRoutes
  };

  registerAPIRoutes(registryData, registryErr => {
    if (err) {
      req.error = registryErr;
      return next();
    }
    
    persistRegistryToCache(registryData, cacheErr => {
      if (err) {
        req.error = cacheErr;
      } else {
        req.results = { success: true };
      }
      next();
    });
  });
};

const deleteApiRegistry = (req, results, next) => {
  const { containerName, containerPort, apiRoutes } = req.body;
  
  if (!containerName || !containerPort || !apiRoutes) {
    req.error = 'Bad request data.';
    return next();
  }

  const registryData = {
    containerName,
    containerPort,
    apiRoutes
  };
  
  unregisterAPIRoutes(containerName, registryErr => {
    if (err) {
      req.error = registryErr;
      return next();
    }
    
    removeRegistryFromCache(registryData, cacheErr => {
      if (err) {
        req.error = cacheErr;
      } else {
        req.results = { success: true };
      }
      next();
    });
  });
};

// ======================================================
// Attach Handlers
// ======================================================
registryController.post('/', postApiRegistry, responseHandler);
registryController.delete('/', deleteApiRegistry, responseHandler);

module.exports = registryController;
