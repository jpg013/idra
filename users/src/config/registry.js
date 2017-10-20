const httpGetUserByUsername = {
  protocol: 'http-post',
  endpoint: 'users/username',
  authorizedRoles: ['sysAdmin'],
  originUrl: '/users/username'
}

module.exports = {
  containerName: process.env.CONTAINER_NAME,
  containerPort: process.env.CONTAINER_PORT,
  endpoints: [
    httpGetUserByUsername
  ]
};
