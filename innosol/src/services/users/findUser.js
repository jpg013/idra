const dbConnector  = require('../../db/connector');
const mapUserProps = require('./mapUserProps');

const findOne = (username, cb) => {
  dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    const userCollection = db.collection('users');

    const $query = { un: username };

    userCollection.findOne($query, (findErr, result) => {
      if (findErr) {
        return cb(findErr);
      }

      if (!result) {
        return cb(findErr);
      }
      
      return cb(findErr, mapUserProps(result));
    });  
  });
};

module.exports = findOne;
