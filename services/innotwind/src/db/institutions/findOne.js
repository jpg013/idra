const dbConnector      = require('../connector');

const findOne = ($query, cb) => {
  dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    const institutionCollection = db.collection('institutions');

    institutionCollection.findOne($query, (err, result) => {
      if (err) {
        return cb(err);
      }
      return cb(err, result);
    });
  });
};

module.exports = findOne;
