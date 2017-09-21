const getCacheClient = require('./client');

const executeSingle = (command, cb) => {
  const cacheClient = getCacheClient();
  command(cacheClient, cb);
};

const executeMultiple = (command, cb) => {
  const cacheClient = getCacheClient();
  const multi = client.multi();
  
  async.eachSeries(com)
  
  commands.forEach(cur => cur(multi));
  
  // drains multi queue and runs atomically
  multi.exec(err);
};

const executeCommand = (command, cb) => {
  command(getCacheClient(), cb);
};

module.exports = executeCommand;
