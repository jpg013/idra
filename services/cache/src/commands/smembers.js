const winston = require('winston');

const logger = msg => {
  winston.log('info', 'smembers log: ', { msg: msg });
};

const smembers = (key, dbIndex) => {
  return (client, cb) => {
    cb = cb ? cb : logger;

    client.select(dbIndex, (err) => {
      if (err) {
        return cb(err);  
      }
      client.smembers(key, cb);
    });
  };
};

module.exports = smembers;
