const databaseConnector  = require('../../db/connector');
const buildRouteQuery    = require('./buildRouteQuery');
const mapRouteProps   = require('./mapRouteProps');

const findRoutes = (queryProps={}, cb) => {
  const $query = buildRouteQuery(queryProps);
  
  databaseConnector.getConnection((dbErr, db) => {
    if (dbErr) {
      return cb(dbErr);
    }

    if (!db) {
      return cb('Could not connect to database.');
    }

    const col = db.collection('routes');
    col.find($query).toArray((err, results) => {
      if (err) {
        return cb(err);
      }
      cb(err, results.map(mapRouteProps));
    });
  });
};

module.exports = findRoutes;
