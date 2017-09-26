const sadd     = require('../commands/sadd');
const smembers = require('../commands/smembers');
const hmset    = require('../commands/hmset');
const hgetall  = require('../commands/hgetall');

const makeCacheCommand = ({commandName, key, val, dbIndex}) => {
  switch(commandName) {
    case 'sadd':
      return sadd(key, val, dbIndex);
    case 'smembers':
      return smembers(key, dbIndex);
    case 'hmset':
      return hmset(key, val, dbIndex);
    case 'hgetall':
      return hgetall(key, dbIndex);
    default:
      return undefined;
  }
}

module.exports = makeCacheCommand;