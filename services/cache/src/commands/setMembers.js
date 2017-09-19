const winston = require('winston');

const logger = msg => {
  winston.log('info', 'smembers log: ', { msg: msg });
};

const setMembers = key => {
  return (client, cb) => {
    cb = cb ? cb : logger;
    client.smembers(key, cb);
  };
};

module.exports = setMembers;
