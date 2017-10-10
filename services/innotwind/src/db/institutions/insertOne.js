const dbConnector = require('../connector');

const insertOne = ($insert, cb) => {
  dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    if (!db) {
      return cb('Could not secure database connection.');
    }

    const institutionCollection = db.collection('institutions');

    institutionCollection.insertOne($insert, (insertErr, result) => {
      if (insertErr) {
        return cb(insertErr);
      }
      if (result.insertedCount !== 1) {
        return cb('There was an error inserting the institution.');
      }
      cb();
    });
  });
};

module.exports = insertOne;
