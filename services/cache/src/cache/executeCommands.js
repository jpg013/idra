const getCacheClient = require('./client');
const setAdd = require('../commands/setAdd');
const setMembers = require('../commands/setMembers');
const hashMapSet = require('../commands/hashMapSet');
const winston = require('winston');

const executeSingle = commands => {
  const cacheClient = getCacheClient();
  const command = commands[0];
  command(cacheClient);
};

const executeMultiple = commands => {
  const cacheClient = getCacheClient();
  const multi = client.multi();
  
  commands.forEach(cur => cur(multi));
  
  // drains multi queue and runs atomically
  multi.exec((err, replies) => {
    if (err) {
      winston.info('error', 'There was an error running multiple commands.', {
        errMsg: err
      });
    } else {
      winston.info('info', 'Successfully ran multiple commands', { replies });
    }
  });
};

const executeCommands = (data=[]) => {
  const commands = makeCommandPipleline(data);
  if (!commands.length) {
    return;
  }
  
  if (commands.length === 1) {
    executeSingle(commands);
  } else {
    executeMultiple(commands);
  }
};

const makeCommandPipleline = (data=[]) => {
  return data.map(cur => {
    const { name, key, val} = cur;
    switch(name) {
      case 'setAdd':
        return setAdd(key, val);
      case 'setMembers':
        return setMember(key);
      case 'hashMapSet':
        return hashMapSet(key, val);
      default:
        return undefined;
    }
  }).filter(cur => !!cur);
};

module.exports = executeCommands;
