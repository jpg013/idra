const makeUrl = require('../helpers/makeUrl');
const request = require('request');

const dialUpsertServiceDefinition = (data, callback) => {
  const {
    serviceName,
    host,
    port
  } = data;
  
  const url = makeUrl(
    process.env.ROUTE_SERVICE_HTTP_HOST,
    process.env.ROUTE_SERVICE_HTTP_PORT,
    'api/servicedefinitions'
  );
  
  const opts = {
    headers: {'content-type': 'application/json'},
    url,
    method: 'PUT',
    json: { serviceName, host, port }
  };
  
  request(opts, () => callback(undefined, data));
};

module.exports = dialUpsertServiceDefinition;
