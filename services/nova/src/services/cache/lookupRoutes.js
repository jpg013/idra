const async                      = require('async');
const dialCache                  = require('./dialCache');
const makeRouteSetMembersCommand = require('./commands/makeRouteSetMembersCommand');
const makeRouteHashMapGetCommand = require('./commands/makeRouteHashMapGetCommand');
const makeRouteSetAddKey         = require('./keys/makeRouteSetAddKey');

const lookupRoutes = (url, protocol, cb) => {
  const setKey = makeRouteSetAddKey(protocol, url);
  
  const keyMapper = (item, next) => dialCache(makeRouteHashMapGetCommand(item), (err, results={}) => {
    if (err) {
      return next(err);
    }
    const routeData = {
      ...results,
      authorizedRoles: results.authorizedRoles.split(',')
    }
    return next(err, routeData)
  });
  
  const pipeline = [
    next => dialCache(makeRouteSetMembersCommand(setKey), next),
    (endpoints, next) => async.map(endpoints, keyMapper, next)
  ];
  
  async.waterfall(pipeline, cb);
};

module.exports = lookupRoutes;
