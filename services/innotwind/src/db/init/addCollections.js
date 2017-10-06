const async       = require('async');
const winston     = require('winston');
const dbConnector = require('../connector');

const colInfos = {
  'institutions': {},
  'imports': {}
};

const getCollectionsNeedAdded = colList => Object.keys(colInfos).filter(cur => colList.indexOf(cur) < 0);

const addCollections = cb => {
  dbConnector.getConnection((err, db) => {
    if (err) {
      return cb(err);
    }

    if (!db) {
      return cb('Could not secure database connection.');
    }

    db.listCollections().toArray((err, colList=[]) => {
      winston.info('info', 'Existing Innotwind Collection List', { colList });
      
      if (err) {
        return cb(err);
      }
      
      const colsNeedAddeed = getCollectionsNeedAdded(colList.map(cur => cur.name));
      
      async.eachSeries(colsNeedAddeed, (item, next) => {
        db.createCollection(item, colInfos[item], next);
      }, cb);
    });    

  });
};

module.exports = addCollections;
