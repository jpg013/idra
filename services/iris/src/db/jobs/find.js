const dbConnector      = require('../connector');

const find = ($query, cb) => {
  dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    const collection = db.collection('jobs');

    collection.find($query).toArray((err, results=[]) => {
      if (err) {
        return cb(err);
      }
      return cb(err, results);
    });
  });
};

module.exports = find;
