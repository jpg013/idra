const winston = require('winston');

const logger = msg => {
  winston.log('info', 'hmset log: ', { msg: msg });
};

const hashMapSet = (key, val) => {
  return (client, cb) => {
    cb = cb ? cb : logger;
    client.hmset(key, val, cb);
  };
};

module.exports = hashMapSet;
