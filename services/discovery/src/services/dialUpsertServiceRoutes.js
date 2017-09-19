const makeUrl = require('../helpers/makeUrl');
const request = require('request');

const dialUpsertServiceRoutes = (data, callback) => {
  const { serviceName, routes } = data;
  
  const url = makeUrl(
    process.env.ROUTE_SERVICE_HTTP_HOST,
    process.env.ROUTE_SERVICE_HTTP_PORT,
    'api/serviceroutes'
  );
  
  const opts = {
    headers: {'content-type': 'application/json'},
    url,
    method: 'PUT',
    json: { serviceName, routes }
  };
  
  request(opts, () => callback(undefined, data));
};

module.exports = dialUpsertServiceRoutes;
