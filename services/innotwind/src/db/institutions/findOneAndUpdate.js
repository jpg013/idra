const dbConnector  = require('../../db/connector');
const makeObjectId = require('../../db/makeObjectId');

const findOneAndUpdate = (id, $update, cb) => {
  dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    const institutionCollection = db.collection('institutions');
    const $query = { _id: makeObjectId(id) };

    institutionCollection.findOneAndUpdate($query, $update, cb);
  });
}

module.exports = findOneAndUpdate;
