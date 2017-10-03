const makeRouteHashMapKey = require('../keys/makeRouteHashMapKey');

const makeRouteHashMapSetCommand = ({url, protocol, containerName, containerPort, endpoint, authorizedRoles}) => {
  const hmVal = {
    endpoint,
    url,
    protocol,
    authorizedRoles: authorizedRoles.join(','),
    containerName,
    containerPort
  };
  
  return {
    json: {
      key: makeRouteHashMapKey(protocol, containerName, containerPort, endpoint),  
      val: hmVal,
    },
    protocol: 'http-post',
    endpoint: 'hashmapset',
    queryParams: {
      database: 'routing'
    }
  }
};

module.exports = makeRouteHashMapSetCommand;
