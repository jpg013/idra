const makeRouteSetKey = (protocol, originUrl) => {
  return `${protocol}:${originUrl}`;
};

const makeRouteHashMapKey = (protocol, containerName, containerPort, routeUrl) => {
  return `${protocol}:${containerName}:${containerPort}/${routeUrl}`;
};

module.exports = {
  makeRouteSetKey,
  makeRouteHashMapKey
};
