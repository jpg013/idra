const redis   = require('redis');
const winston = require('winston');

const onConnectionRetry = options => {
  console.log('retrying connection!!!!');
  console.log(options);
  if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection');
  }
  if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted');
  }
  if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
  }
  // reconnect after
  return Math.min(options.attempt * 100, 3000);
};

const onClientError = err => {
  winston.log('error', 'There was an error connecting to redis!', {
    errMsg: err
  });
};

const clientOptions = {
  url: process.env.REDIS_CONNECTION,
  retry_strategy: onConnectionRetry
};

const redisClient = redis.createClient(clientOptions);

redisClient.on('error', onClientError);

module.exports = () => redisClient;
