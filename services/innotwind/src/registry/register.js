const dial         = require('../dial');
const registryData = require('./registryData');

const register = () => {
  const dialOptions = {
    containerName: process.env.ROUTER_CONTAINER_NAME,
    containerPort: process.env.ROUTER_CONTAINER_PORT,
    endpoint: 'registry',
    protocol: 'post',
    json: Object.assign({}, registryData)
  };
  
  dial(dialOptions);
};

module.exports = register;
