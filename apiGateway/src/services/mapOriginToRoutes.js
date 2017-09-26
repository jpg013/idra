const dial = require('../dial');

const mapOriginToRoutes = (url, protocol, cb) => {
  const queryParams = {
    url,
    protocol
  };
  const dialOptions = {
    containerName: process.env.ROUTER_CONTAINER_NAME,
    containerPort: process.env.ROUTER_CONTAINER_PORT,
    endpoint: 'routing',
    queryParams,
    protocol: 'http-get'
  };
  
  dial(dialOptions, cb);
};

module.exports = mapOriginToRoutes;
