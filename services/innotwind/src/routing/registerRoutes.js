const dial        = require('../dial');
const routingData = require('./routingData');

const registerRoutes = () => {
  const dialOptions = {
    containerName: process.env.ROUTER_CONTAINER_NAME,
    containerPort: process.env.ROUTER_CONTAINER_PORT,
    endpoint: 'routing',
    protocol: 'post',
    json: Object.assign({}, routingData)
  };
  
  dial(dialOptions);
};

module.exports = registerRoutes;
