const databaseConnector  = require('../../db/connector');
const makeRouteInsert    = require('./makeRouteInsert');

const upsertRoute = (routingData, cb) => {
  const { containerName } = routingData;
  databaseConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    if (!db) {
      return cb('Could not connect to database.');
    }

    const col = db.collection('routes');
    const $query = { containerName };
    const $insert = makeRouteInsert(routingData);
    const $opts = { upsert: true };
    
    col.updateOne($query, $insert, $opts, cb);
  });
};

module.exports = upsertRoute;
