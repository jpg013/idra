const winston = require('winston');

const logger = msg => {
  winston.log('info', 'hmset log: ', { msg: msg });
};

const hmset = (key, val, dbIndex) => {
  return (client, cb) => {
    cb = cb ? cb : logger;

    client.select(dbIndex, (err) => {
      if (err) {
        return cb(err);  
      }
      client.hmset(key, val, cb);
    });
  };
};

module.exports = hmset;