const dial = require('../dial');

const getServiceRoutesForURL = (originUrl='', requestMethod='', cb) => {
  const queryParams = {
    originUrl,
    requestMethod
  };
  
  const dialOptions = {
    serviceName: 'router',
    port: '6969',
    endpoint: '/serviceroutes',
    queryParams,
    requestMethod: 'get'
  };
  
  dial(dialOptions, cb);
};

module.exports = getServiceRoutesForURL;
