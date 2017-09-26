const dial         = require('../dial');
const registryData = require('./registryData');

const unregister = () => {
  const dialOptions = {
    containerName: process.env.ROUTER_CONTAINER_NAME,
    containerPort: process.env.ROUTER_CONTAINER_PORT,
    endpoint: 'routing',
    protocol: 'delete',
    json: Object.assign({}, apiRegistryData)
  };
  
  dial(dialOptions);
};

module.exports = unregister;
