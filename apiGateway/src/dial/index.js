const request        = require('request');
const buildURL       = require('./buildURL');
const formatProtocol = require('./formatProtocol');

const dial = (dialOptions={}, callback) => {
  const { containerName, containerPort, endpoint, protocol, json, queryParams} = dialOptions;
  
  const headers = {
    'content-type': 'application/json'
  };
  
  const url = buildURL(containerName, containerPort, endpoint, queryParams);
  
  const requestOptions = Object.assign({}, {
    headers,
    url,
    json,
    method: formatProtocol(protocol)
  });
  
  request(requestOptions, (err, req, body) => {
    if (err) {
      return callback(err);
    }

    const { statusCode } = req;
    
    let resp = body;
    if (typeof body === 'string') {
      try {
        resp = JSON.parse(body);
      } catch (e) {
        // fall through
      }
    }
    
    const results = Object.assign({ statusCode }, resp);
    callback(err, results);
  });
};

module.exports = dial;
