const dbConnector           = require('../../db/connector');
const makeInstitutionUpdate = require('./makeInstitutionUpdate');
const makeObjectId          = require('../../db/makeObjectId');

const updateInstitution = (id, $update, cb) => {
  dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    const institutionCollection = db.collection('institutions');
    const $query = { _id: makeObjectId(id) };

    institutionCollection.findOneAndUpdate($query, $update, (updateErr, result) => {
      if (updateErr) {
        return cb(updateErr);
      }

      if (!result) {
        return cb(updateErr);
      }

      console.log('we have updated the ticket');
      console.log(result);
      
      return cb(updateErr);
    });  
  });
}

module.exports = updateInstitution;