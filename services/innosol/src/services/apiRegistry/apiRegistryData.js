const httpGetUserByUsernameRouteDetails = {
  originUrl: 'api/users/username',
  protocol: 'http-get',
  routeUrl: 'users/username',
  authorizedRoles: ['sysAdmin']
};

const apiRegistryData = {
  containerName: process.env.CONTAINER_NAME,
  containerPort: process.env.CONTAINER_PORT,
  apiRoutes: [ httpGetUserByUsernameRouteDetails ]
};

module.exports = apiRegistryData;
