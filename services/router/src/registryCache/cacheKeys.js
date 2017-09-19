const makeRouteSetKey = (protocol, originUrl) => {
  return `${protocol}_${originUrl}`;
};

const makeRouteHashMapKey = (protocol, containerName, containerPort, routeUrl) => {
  return `${protocol}-${makeRouteHashMapKey}:${containerPort}/${routeUrl}`;
};

module.exports = {
  makeRouteSetKey,
  makeRouteHashMapKey
};
