const async                       = require('async');
const dialCache                   = require('./dialCache');
const makeRouteHashMapSetCommand  = require('./commands/makeRouteHashMapSetCommand');
const makeRouteSetAddCommand      = require('./commands/makeRouteSetAddCommand');

const populateRoutes = (routingData, cb) => {
  const { containerName, containerPort, endpoints } = routingData;
  
  if (!containerName || !containerPort || !endpoints) {
    return cb('Bad request data.');
  }

  async.each(endpoints, (item, next) => {
    const { endpoint, protocol, authorizedRoles, originUrl } = item;
    const cacheData = {
      containerName,
      containerPort,
      endpoint,
      originUrl,
      protocol,
      authorizedRoles
    };

    const pipeline = [makeRouteSetAddCommand(cacheData), makeRouteHashMapSetCommand(cacheData)];
    async.each(pipeline, dialCache, next);
  }, cb);
};

module.exports = populateRoutes;
