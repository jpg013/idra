const async            = require('async');
const upsertRoute      = require('./routing/upsertRoute');
const populateRoutes   = require('./cache/populateRoutes');

const registerRoutes = (routingData, cb) => {
  const pipeline = [
    next => upsertRoute(routingData, next),
    next => populateRoutes(routingData, next),
  ];
  
  async.parallel(pipeline, cb);
};

module.exports = registerRoutes;
