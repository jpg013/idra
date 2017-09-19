const async     = require('async');
const cacheKeys = require('./cacheKeys');

const removeServiceFromRegistryCache = (serviceData, cb) => {
  const { containerName, containerPort, routes } = serviceData;
  
  if (!containerName || !containerPort || !routes) {
    return cb('Bad request data.');
  }
  

};

module.exports = removeServiceFromRegistryCache;
