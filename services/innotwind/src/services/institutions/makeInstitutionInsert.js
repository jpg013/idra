const encrypt = require('../../helpers/encrypt');

const makeInstitutionInsert = institutionData => {
  const { 
    name,
  } = institutionData;

  return {
    n: name
  }
};

module.exports = makeInstitutionInsert;