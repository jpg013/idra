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

  return callback ? wrapRequestCallback(requestOptions, callback) : wrapRequestPromise(requestOptions)
};

const wrapRequestPromise = requestOptions => {
  return new Promise((resolve, reject) => {
    request(requestOptions, (err, req, body) => {
      if (err) {
        return reject(err);
      }
      return resolve(parseResponseBody(body));
    });
  })
}

const wrapRequestCallback = (requestOptions, callback) => {
  request(requestOptions, (err, req, body) => {
    if (err) {
      return callback(err);
    }
    return callback(err, parseResponseBody(body));
  });
}

module.exports = dial;
