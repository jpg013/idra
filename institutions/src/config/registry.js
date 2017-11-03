const getInstitutions = {
  method: 'http-get',
  endpoint: 'institutions',
  rolePermissions: ['sysAdmin'],
  originUrl: '/institutions'
}

module.exports = {
  containerName: process.env.CONTAINER_NAME,
  containerPort: process.env.CONTAINER_PORT,
  endpoints: [
    httpGetUserByUsername
  ]
};
