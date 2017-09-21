const async              = require('async');
const addCollections     = require('./addCollections');
const addRootInstitution = require('./addRootInstitution');

const initDb = cb => {
  const initPipeline = [addCollections, addRootInstitution];

  async.series(initPipeline, cb);
};

module.exports = initDb;