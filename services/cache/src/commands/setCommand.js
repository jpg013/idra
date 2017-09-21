const winston  = require('winston');

const logger = msg => {
  winston.log('info', 'set log: ', { msg: msg });
};

const set = (key, val, db) => {
  return (client, cb) => {
    cb = cb ? cb : logger;
    
    client.select(db, (err) => {
      if (err) {
        return cb(err);  
      }
      client.set(key, val, cb);    
    });
  };
};

module.exports = set;
