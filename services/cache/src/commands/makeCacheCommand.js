const sadd     = require('../commands/sadd');
//const set        = require('../commands/set');
//const setMembers = require('../commands/setMembers');
const hmset = require('../commands/hmset');

const makeCacheCommand = (commandName, key, val, dbIndex) => {
  switch(commandName) {
    // case 'set':
      // return set(key, val, dbIndex);
    case 'sadd':
      return sadd(key, val, dbIndex);
    // case 'setMembers':
      // return setMember(key, dbIndex);
    case 'hmset':
      return hmset(key, val, dbIndex);
    default:
      return undefined;
  }
}

module.exports = makeCacheCommand;