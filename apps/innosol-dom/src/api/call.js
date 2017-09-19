import 'whatwg-fetch';
import { getAuthTokenFromStorage } from '../services/storageService';
import { buildUri } from './buildUri';
import { buildConfig } from './buildConfig';
import { makeApiError } from './makeApiError';

export default function(endpoint, method='get', opts={}) {
  const headers = {
    'Content-Type': 'application/json'
  };
  const { token } = getAuthTokenFromStorage() || {};

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const uri = buildUri(endpoint, method, opts);
  const config = Object.assign({}, buildConfig(method, opts), { headers, method});

  return fetch(uri, config)
    .then(function(resp) {
      if (resp.status === 200 || resp.status === 304) {
        return resp.json();
      } else {
        throw makeApiError(resp.status, resp.statusText);
      }
    });
};
