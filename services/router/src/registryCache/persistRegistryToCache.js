const async     = require('async');
const cacheKeys = require('./cacheKeys');
const dial      = require('../dial');

const persistRegistryToCache = (registryData, cb) => {
  const { containerName, containerPort, routes } = registryData;
  
  if (!containerName || !containerPort || !routes) {
    return cb('Bad request data.');
  }

  async.eachSeries(routes, (item, next) => {
    const { routeUrl, originUrl, protocol, authorizedRoles } = item;
    
    const setKey = cacheKeys.makeRouteSetKey(protocol, originUrl);
    const hashMapKey = cacheKeys.makeRouteHashMapKey(protocol, containerName, containerPort, routeUrl);

    const hashMapValue = {
      routeUrl,
      originUrl,
      protocol,
      authorizedRoles: authorizedRoles.join(','),
      containerName,
      containerPort
    };

    const setAddData = {
      json: {
        key: setKey,
        val: hashMapKey,  
      },
      protocol: 'http-post',
      endpoint: 'sadd'
    };

    const hashMapSetData = {
      json: {
        key: hashMapKey,
        val: hashMapValue
      },
      protocol: 'http-post',
      endpoint: 'hmset'
    }

    const pipeline = [setAddData, hashMapSetData];

    async.each(pipeline, (cur, onDone) => {
      const { protocol, json, endpoint } = cur;
      const dialOptions = {
        containerName: process.env.CACHE_CONTAINER_NAME,
        containerPort: process.env.CACHE_CONTAINER_PORT,
        endpoint,
        protocol,
        json
      };

      dial(dialOptions, onDone);
    }, next);
  }, cb);
};

module.exports = persistRegistryToCache;
