const dial = require('../dial');

const callRoute = (route, args, cb) => {
  const { containerName, containerPort, endpoint, authorizedRoles } = route;
  const { queryParams, user, json, protocol } = args;
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

module.exports = callRoute;
