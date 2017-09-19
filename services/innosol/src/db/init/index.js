const async          = require('async');
const addCollections = require('./addCollections');
const addRootUser    = require('./addRootUser');

const initDb = cb => {
  const initPipeline = [addCollections, addRootUser];

  async.series(initPipeline, cb);
};

module.exports = initDb;