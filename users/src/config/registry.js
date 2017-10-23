const httpGetUserByUsername = {
  method: 'http-post',
  endpoint: 'users/username',
  rolePermissions: ['sysAdmin'],
  originUrl: '/users/username'
}

module.exports = {
  containerName: process.env.CONTAINER_NAME,
  containerPort: process.env.CONTAINER_PORT,
  endpoints: [
    httpGetUserByUsername
  ]
};
