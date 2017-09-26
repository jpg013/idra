const winston = require('winston');

const logger = msg => {
  winston.log('info', 'hgetall log: ', { msg: msg });
};

const hgetall = (key, dbIndex) => {
  return (client, cb) => {
    cb = cb ? cb : logger;

    client.select(dbIndex, (err) => {
      if (err) {
        return cb(err);  
      }
      client.hgetall(key, cb);
    });
  };
};

module.exports = hgetall;