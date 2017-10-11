const dbConnector  = require('../../db/connector');
const makeObjectId = require('../../db/makeObjectId');

const findOneAndUpdate = (id, $update, cb) => {
  dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    const collection = db.collection('jobs');
    const $query = { _id: makeObjectId(id) };

    collection.findOneAndUpdate($query, $update, cb);
  });
}

module.exports = findOneAndUpdate;
