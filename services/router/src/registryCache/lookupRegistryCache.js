const client    = require('./client');
const async     = require('async');
const cacheKeys = require('./cacheKeys');

const lookupRegistryCache = (requestMethod, originUrl, cb) => {
  if (!requestMethod || !originUrl) {
    return cb('Bad request data.');
  }

  const cacheClient = client.getClient();
  const sKey = cacheKeys.makeSKey(requestMethod, originUrl);
  
  cacheClient.smembers(sKey, (err, results=[]) => {
    if (err) {
      return cb(err);
    }

    async.map(results, (item, next) => {
      cacheClient.hgetall(item, next);
    }, cb); 
  });
};

module.exports = lookupRegistryCache;
