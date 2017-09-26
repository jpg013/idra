const async                       = require('async');
const dialCache                   = require('./dialCache');
const makeRouteHashMapSetCommand  = require('./commands/makeRouteHashMapSetCommand');
const makeRouteSetAddCommand      = require('./commands/makeRouteSetAddCommand');

const populateRoutes = (routingData, cb) => {
  const { containerName, containerPort, endpoints } = routingData;
  
  if (!containerName || !containerPort || !endpoints) {
    return cb('Bad request data.');
  }

  async.eachSeries(endpoints, (item, next) => {
    const { endpoint, url, protocol, authorizedRoles } = item;
    const cacheData = {
      containerName,
      containerPort,
      endpoint,
      url,
      protocol,
      authorizedRoles
    };

    const pipeline = [makeRouteSetAddCommand(cacheData), makeRouteHashMapSetCommand(cacheData)];
    async.each(pipeline, dialCache, cb);
  }, cb);
};

module.exports = populateRoutes;
