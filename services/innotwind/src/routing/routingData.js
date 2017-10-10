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

const httpGetBlackbaudAuthUrl = {
  protocol: 'http-get',
  endpoint: 'blackbaud/auth/url',
  authorizedRoles: ['sysAdmin'],
  originUrl: '/blackbaud/auth/url'
}

const httpPostBlackbaudAuthCode = {
  protocol: 'http-post',
  endpoint: 'blackbaud/auth/code',
  authorizedRoles: ['sysAdmin'],
  originUrl: '/blackbaud/auth/code'
}

const httpPostAlumniImportJob = {
  protocol: 'http-post',
  endpoint: 'alumniimportjobs',
  authorizedRoles: ['sysAdmin'],
  originUrl: '/alumniimportjobs'
}

const routingData = {
  containerName: process.env.CONTAINER_NAME,
  containerPort: process.env.CONTAINER_PORT,
  endpoints: [ 
    httpGetInstitutions, 
    httpPostInstitution, 
    httpGetInstitutionDetails, 
    httpGetBlackbaudAuthUrl,
    httpPostBlackbaudAuthCode,
    httpPostAlumniImportJob
  ]
};

module.exports = routingData;
