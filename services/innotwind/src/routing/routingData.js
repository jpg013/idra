const httpGetInstitutions = {
  protocol: 'http-get',
  endpoint: 'institutions',
  authorizedRoles: ['sysAdmin'],
  originUrl: '/institutions'
};

const httpPostInstitution = {
  protocol: 'http-post',
  endpoint: 'institutions',
  authorizedRoles: ['sysAdmin'],
  originUrl: '/institutions'
};

const httpGetInstitutionDetails = {
  protocol: 'http-get',
  endpoint: 'institutions/details',
  authorizedRoles: ['sysAdmin'],
  originUrl: '/institutions/details'
}

const httpGetInstitutionAuth = {
  protocol: 'http-get',
  endpoint: 'institutions/auth',
  authorizedRoles: ['sysAdmin'],
  originUrl: '/institutions/auth'
}

const httpPostInstitutionAuthCallback = {
  protocol: 'http-post',
  endpoint: 'institutions/auth/callback',
  authorizedRoles: ['sysAdmin'],
  originUrl: '/institutions/auth/callback'
}

const routingData = {
  containerName: process.env.CONTAINER_NAME,
  containerPort: process.env.CONTAINER_PORT,
  endpoints: [ 
    httpGetInstitutions, 
    httpPostInstitution, 
    httpGetInstitutionDetails, 
    httpGetInstitutionAuth,
    httpPostInstitutionAuthCallback ]
};

module.exports = routingData;
