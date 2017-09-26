const dial = require('../../dial');

const dialCache = ({protocol, json, endpoint, queryParams}, cb) => {
  const dialOptions = {
    containerName: process.env.CACHE_CONTAINER_NAME,
    containerPort: process.env.CACHE_CONTAINER_PORT,
    endpoint,
    protocol,
    json,
    queryParams
  };
  
  dial(dialOptions, cb);
};

module.exports = dialCache;