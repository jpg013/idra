const async              = require('async');
const addCollections     = require('./addCollections');
const addRootInstitution = require('./addRootInstitution');

const initDb = cb => {
  const initPipeline = [addCollections, addRootUser];

  async.series(initPipeline, cb);
};

module.exports = initDb;