const httpGetInstitutions = {
  protocol: 'http-get',
  endpoint: 'institutions',
  authorizedRoles: ['sysAdmin'],
};

const httpPostInstitution = {
  protocol: 'http-post',
  endpoint: 'institutions',
  authorizedRoles: ['sysAdmin']
};

const routingData = {
  containerName: process.env.CONTAINER_NAME,
  containerPort: process.env.CONTAINER_PORT,
  endpoints: [ httpGetInstitutions, httpPostInstitution ]
};

module.exports = routingData;
