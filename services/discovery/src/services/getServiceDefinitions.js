const request = require('request');
const makeUrl = require('../helpers/makeUrl');

const getServiceDefinitions = cb => {
  const url = makeUrl(
    process.env.ROUTE_SERVICE_HTTP_HOST,
    process.env.ROUTE_SERVICE_HTTP_PORT,
    'api/servicedefinitions'
  );
  
  request(url,  function (err, resp, body) {
    if (err) {
      return cb(err, cb);
    }
    
    if (resp && resp.statusCode !== 200) {
      // Handle bad response
      return cb('bad response');
    }
    return cb(err, JSON.parse(body).results);
  });
};

module.exports = getServiceDefinitions;
