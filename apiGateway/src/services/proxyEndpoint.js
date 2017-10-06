const dial = require('../dial');

const proxyEndpoint = (route, args, cb) => {
  const { containerName, containerPort, endpoint, authorizedRoles, protocol } = route;
  const { queryParams, user, json } = args;
  const dialOptions = {
    containerName,
    containerPort,
    queryParams,
    json,
    protocol,
    endpoint
  };
  
  dial(dialOptions, cb);
};

module.exports = proxyEndpoint;
