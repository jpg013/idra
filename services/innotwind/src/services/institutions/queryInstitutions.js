const dbConnector         = require('../../db/connector');
const mapInstitutionProps = require('./mapInstitutionProps');

const queryInstitutions = ($query, cb) => {
  dbConnector.getConnection((conErr, db) => {
    if (conErr) {
      return cb(conErr);
    }

    const institutionCollection = db.collection('institutions');
    institutionCollection.find($query).toArray((err, results=[]) => {
      if (err) {
        return cb(err);
      }
      return cb(err, results.map(mapInstitutionProps));
    });  
  });
};

module.exports = queryInstitutions;
