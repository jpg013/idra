const async              = require('async');
const addCollections     = require('./addCollections');

const initDb = cb => {
  const initPipeline = [addCollections];

  async.series(initPipeline, cb);
};

module.exports = initDb;