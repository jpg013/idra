const dbConnector  = require('../../db/connector');
const makeObjectId = require('../makeObjectId');

const findById = (id, cb) => {
  dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    const collection = db.collection('jobs');
    const $query = { _id: makeObjectId(id) };

    collection.findOne($query, (findErr, result) => {
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
