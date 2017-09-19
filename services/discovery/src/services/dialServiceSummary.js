const request       = require('request');
const makeUrl       = require('../helpers/makeUrl');
const handleError   = require('./handleServiceSummaryError');
const handleSuccess = require('./handleServiceSummarySuccess');

const dialServiceSummary = (serviceDefinition, cb) => {
  const serviceUrl = makeUrl(
    serviceDefinition.host,
    serviceDefinition.port,
    'summary'
  );
  
  request(serviceUrl, function (err, response, body) {
    if (err) {
      return handleError(err, cb);
    }
    if (response.statusCode !== 200) {
      return cb('bad request');
    }
    const { results } = JSON.parse(body);
    
    if (!results) {
      return cb('summary returned no results');
    }
    return handleSuccess(results, cb);
  });
};

module.exports = dialServiceSummary;
