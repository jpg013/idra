const async   = require('async');
const winston = require('winston');

const colInfos = {
  'registry': {}
};

const getCollectionsNeedAdded = colList => Object.keys(colInfos).filter(cur => colList.indexOf(cur) < 0);

const createCollections = (database, cb) => {
  database.listCollections().toArray((err, colList=[]) => {
    winston.info('info', 'Router DB Collection List', { colList });
    
    if (err) {
      return cb(err);
    }
    
    const colsNeedAddeed = getCollectionsNeedAdded(colList.map(cur => cur.name));

    async.eachSeries(colsNeedAddeed, (item, next) => {
      database.createCollection(item, colInfos[item], next);
    }, cb);
  });
};

module.exports = {
  createCollections
};
