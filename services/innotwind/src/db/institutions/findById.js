const dbConnector  = require('../../db/connector');
const makeObjectId = require('../makeObjectId');

const findById = (id, cb) => {
  dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    const institutionCollection = db.collection('institutions');
    const $query = { _id: makeObjectId(id) };

    institutionCollection.findOne($query, (findErr, result) => {
      if (findErr) {
        return cb(findErr);
      }
      if (!result) {
        return cb(findErr);
      }
      return cb(findErr, result);
    });
  });
};

module.exports = findById;
