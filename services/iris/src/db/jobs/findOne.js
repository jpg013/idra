const dbConnector      = require('../connector');

const findOne = ($query, cb) => {
  dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    const collection = db.collection('jobs');

    collection.findOne($query, (err, result) => {
      if (err) {
        return cb(err);
      }
      return cb(err, result);
    });
  });
};

module.exports = findOne;
