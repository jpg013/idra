const encrypt = require('./encrypt');

const makeUrl = (host, port, endpoint) => {
   return `${host}:${port}/${endpoint}?access_secret=${encrypt(process.env.SERVICE_ACCESS_SECRET)}`;
};

module.exports = makeUrl;
