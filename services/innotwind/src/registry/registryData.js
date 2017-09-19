const httpGetInstitutions = {
  originUrl: 'api/institutions',
  protocol: 'http-get',
  routeUrl: 'institutions',
  authorizedRoles: ['sysAdmin']
};

const httpPostInstitution = {
  originUrl: 'api/institutions',
  protocol: 'http-post',
  routeUrl: 'institutions',
  authorizedRoles: ['sysAdmin']
};

const registryData = {
  containerName: process.env.CONTAINER_NAME,
  containerPort: process.env.CONTAINER_PORT,
  routes: [ httpGetInstitutions, httpPostInstitution ]
};

module.exports = registryData;
