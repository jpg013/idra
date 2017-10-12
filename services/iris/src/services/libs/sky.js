const dial = require('./dial');

function proxy(url, method, creds, opts, callback) {
  const { access_token, subscriptionKey } = creds;

  const headers = {
    'bb-api-subscription-key': subscriptionKey,
    'Authorization': 'Bearer ' + access_token
  };

  const args = {
    headers,
    ...opts,
  };

  dial(url, method, args, callback);
}

const baseUrl = 'https://api.sky.blackbaud.com/constituent/v1/';

function getConstituents(creds, params, callback) {
  const url = `${baseUrl}constituents`;

  const baseArgs = {
    include_inactive: true,
    include_deceased: true,
    limit: 5,
    offset: 0
  };

  const args = {
    queryParams: {
      ...baseArgs,
      ...params
    }
  };

  proxy(url, 'get', creds, args, callback);
}

module.exports = {
  getConstituents
};
