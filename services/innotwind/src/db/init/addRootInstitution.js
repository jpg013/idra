const async           = require('async');
const findInstitution = require('../../services/institutions/findInstitution');
const addInstitution  = require('../../services/institutions/addInstitution');

const rootInstitutionData = {
  name: 'University of Central Missouri',
};

const addRootInstitution = cb => {
  findInstitution(rootInstitutionData.name, (findErr, institution) => {
    if (findErr) {
      return cb(findErr);
    }

    if (institution) {
      return cb();
    }

    addInstitution(rootInstitutionData, addErr => {
      return cb(addErr);
    });
  });
};

module.exports = addRootInstitution;
