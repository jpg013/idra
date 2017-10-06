const dbConnector         = require('../../db/connector');
const mapInstitutionProps = require('./mapInstitutionProps');
const makeObjectId        = require('../../db/makeObjectId');

const findInstitution = (id, cb) => {
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
      
      return cb(findErr, mapInstitutionProps(result));
    });  
  });
};

module.exports = findInstitution;
