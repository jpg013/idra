const makeRouteInsert = routingData => {
  const { containerName, containerPort, endpoints } = routingData;
  return { 
    containerName, 
    containerPort, 
    endpoints 
  };
};

module.exports = makeRouteInsert;
