const dbConnector      = require('../connector');

const find = ($query, $proj, cb) => {
  dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    const collection = db.collection('jobs');

    collection.find($query, $proj).toArray((err, results=[]) => {
      if (err) {
        return cb(err);
      }
      return cb(err, results);
    });
  });
};

module.exports = find;
