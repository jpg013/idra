const mapInstitutionsProps = fields => {
  if (!fields) {
    return;
  }  

  const {
    n: name,
    n4c: neo4jConnection,
    n4a: neo4jAuth,
    cd: createdDate,
    rs: reports,
    uc: userCount,
    la: lastActivity,
    bbc: blackBaudCredentials,
    _id: id,
    ci: completedImport
  } = fields;

  return {
    name,
    neo4jConnection,
    neo4jAuth,
    createdDate,
    reports,
    userCount,
    lastActivity,
    completedImport,
    blackBaudCredentials: {
      ticket: blackBaudCredentials.ti,
      state: blackBaudCredentials.st,
      expires: blackBaudCredentials.ex,
      blackbaudClientId: blackBaudCredentials.id,
      blackbaudClientSecret: blackBaudCredentials.se,
      blackbaudSubscriptionKey: blackBaudCredentials.sk
    },
    id
  };
};

module.exports = mapInstitutionsProps;