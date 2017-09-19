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
  
  request(requestOptions, callback);
};

module.exports = dial;
