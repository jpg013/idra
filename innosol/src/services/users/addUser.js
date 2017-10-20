const dbConnector = require('../../db/connector');
const makeUserInsert = require('./makeUserInsert');

const addUser = (userData={}, cb) => {
  const dbConn = dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    if (!db) {
      return cb('Could not secure database connection.');
    }

    const userCollection = db.collection('users');

    const $insert = makeUserInsert(userData);
    
    userCollection.insertOne($insert, (insertErr, result) => {
      if (insertErr) {
        return cb(insertErr);
      }
      if (result.insertedCount !== 1) {
        return cb('There was an error adding the user.');
      }
      cb();
    });
  });
};

module.exports = addUser;
