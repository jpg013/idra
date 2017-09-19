export const buildConfig = (method, opts) => {
  let config = {};
  if (method === 'get') {
    // Do nothing
  } else if (method === 'post' || method === 'put' || method === 'delete') {
    config.body = JSON.stringify(opts.body);
  }
  return config;
};
