const dial            = require('../dial');
const apiRegistryData = require('./apiRegistryData');

const registerAPI = () => {
  const dialOptions = {
    serviceName: process.env.API_ROUTER_CONTAINER_NAME,
    containerPort: process.env.API_ROUTER_CONTAINER_PORT,
    endpoint: 'apiregistry',
    requestMethod: 'post',
    json: Object.assign({}, apiRegistryData)
  };
  
  dial(dialOptions);
};

module.exports = registerAPI;
