const async     = require('async');
const cacheKeys = require('./cacheKeys');
const dial      = require('../dial');

const persistRegistryToCache = (registryData, cb) => {
  const { containerName, containerPort, routes } = registryData;
  
  if (!containerName || !containerPort || !routes) {
    return cb('Bad request data.');
  }
  
  async.each(routes, (item, next) => {
    const { routeUrl, originUrl, protocol, authorizedRoles } = item;
    
    const setKey = cacheKeys.makeRouteSetKey(protocol, originUrl);
    const hashMapKey = cacheKeys.makeRouteHashMapKey(protocol, containerName, containerPort, routeUrl);
    
    const hashMapValue = {
      routeUrl,
      originUrl,
      protocol,
      authorizedRoles,
      containerName,
      containerPort
    };
      
    const commands = [
      {
        name: 'setAdd',
        key: setKey,
        val: hashMapKey,
        db: 'registry'
      },
      {
        name: 'hashMapSet',
        key: hashMapKey,
        val: hashMapValue,
        db: 'registry'
      }
    ];
    
    const dialOptions = {
      serviceName: 'cache-access',
      containerPort: '6970',
      endpoint: 'cache',
      requestMethod: 'post',
      json: commands
    };

    dial(dialOptions, next);
  }, cb);
};

module.exports = persistRegistryToCache;
