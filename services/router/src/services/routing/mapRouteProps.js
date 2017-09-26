const mapRouteProps = route => {
  const { 
    containerName, 
    containerPort, 
    endpoints 
  } = route;
  
  return {
    containerName, 
    containerPort, 
    endpoints 
  }
}

module.exports = mapRouteProps;