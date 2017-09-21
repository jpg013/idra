const winston  = require('winston');

const logger = msg => {
  winston.log('info', 'sadd log: ', { msg: msg });
};

const sadd = (key, val, dbIndex) => {
  return (client, cb) => {
    cb = cb ? cb : logger;
    
    client.select(dbIndex, (err) => {
      if (err) {
        return cb(err);  
      }
      client.sadd(key, val, cb);    
    });
  };
};

module.exports = sadd;
