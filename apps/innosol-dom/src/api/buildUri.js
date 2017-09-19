import { buildQueryParams } from './buildQueryParams';

const BASE_URI = '/api/';

export const buildUri = (endpoint, method, opts) => {
  let url = BASE_URI + endpoint;
  if (method === 'get' && opts.params) {
    url = `${url}?${buildQueryParams(opts.params)}`;
  }
  return url;
};
