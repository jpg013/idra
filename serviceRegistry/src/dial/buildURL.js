const buildQueryParams           = require('./buildQueryParams');
const makeAccessSecretQueryParam = require('./makeAccessSecretQueryParameter');

const buildURL = (serviceName, port, endpoint, queryParams={}) => {
  let url = `http://${serviceName}:${port}/${endpoint}?${makeAccessSecretQueryParam()}`;
  
  if (queryParams) {
    url += buildQueryParams(queryParams);
  }
  return url;
};

module.exports = buildURL;
