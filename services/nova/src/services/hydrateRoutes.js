const findRoutes       = require('./routing/findRoutes');
const async            = require('async');
const populateRoutes    = require('./cache/populateRoutes');

const hydrateRoutes = () => {
  findRoutes({}, (err, routes=[]) => {
    if (err) {
      winston.log('error', 'There was an error hydrating the registry data!', {
        errMsg: err
      });
      return;  
    }
    async.each(routes, populateRoutes);
  });
}

module.exports = hydrateRoutes;