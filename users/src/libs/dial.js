const request  = require('request');

const baseHeaders = {
  'content-type': 'application/json'
};

const makeQueryParams = params => {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
};

const makeUrl = (url, queryParams) => {
  if (!queryParams) {
    return url;
  }
  return `${url}?${makeQueryParams(queryParams)}`;
};

const parseResponseBody = body => {
  if (!body || typeof body !== 'string') {
    return body;
  }

  let results;

  try {
    results = JSON.parse(body);
  } catch(e) {
    // fall through
    results = body;
  }
  return results;
}

const dial = (endpoint, method, opts={}, callback) => {
  const { json, queryParams } = opts;
  const headers = Object.assign(baseHeaders, opts.headers);
  const url = makeUrl(endpoint, queryParams);
  const requestOptions = Object.assign({}, {
    headers,
    url,
    json,
    method
  });

  request(requestOptions, (err, req, body) => {
    if (err) {
      return callback(err);
    }
    callback(err, parseResponseBody(body));
  });
};

module.exports = dial;
