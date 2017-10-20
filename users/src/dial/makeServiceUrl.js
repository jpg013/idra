const encrypt = require('./encrypt');

const makeServiceUrl = (serviceName, port, endpoint) => {
   return `${serviceName}:${port}/${endpoint}?access_secret=${encrypt(process.env.SERVICE_ACCESS_SECRET)}`;
};

module.exports = makeServiceUrl;
