const winston = require('winston');

const logger = msg => {
  winston.log('info', 'sadd log: ', { msg: msg });
};

const setAdd = (key, val) => {
  return (client, cb) => {
    cb = cb ? cb : logger;
    client.sadd(key, val, cb);
  };
};

module.exports = setAdd;
