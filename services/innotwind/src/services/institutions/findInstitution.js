const dbConnector         = require('../../db/connector');
const mapInstitutionProps = require('./mapInstitutionProps');

const findInstitution = (institutionName, cb) => {
  dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    const institutionCollection = db.collection('institutions');
    const $query = { n: institutionName };

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
