const encrypt = require('../../helpers/encrypt');

const makeInstitutionInsert = institutionData => {
  const { 
    name,
    neo4jConnection,
    neo4jAuth,
    blackbaudClientSecret,
    blackbaudClientId,
    blackbaudSubscriptionKey
  } = institutionData;

  return {
    n: name,
    n4c: neo4jConnection,
    n4a: neo4jAuth,
    cd: new Date(),
    rs: [],
    uc: 0,
    ci: false,
    bbc: {
      st: encrypt(name),
      ti: undefined,
      ex: undefined,
      id: blackbaudClientId,
      se: blackbaudClientSecret,
      sk: blackbaudSubscriptionKey
    }
  };
};

module.exports = makeInstitutionInsert;