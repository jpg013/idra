const Team         = require('../models/teamModel');
const cryptoClient = require('../common/crypto');

function validateTeamFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.name ||
      (fields.name.trim().length < 3) ||
      (!fields.neo4jCredentials || !fields.neo4jCredentials.connection || !fields.neo4jCredentials.auth)
     ) { return false; }
  return true;
}

function scrubTeamData(data) {
  if (!data || typeof data !== 'object') return {};
  const { name, neo4jCredentials, imageURL } = data;
  return {
    name,
    neo4jCredentials,
    imageURL
  };
}

function buildTeamModel(teamFields) {
  const neo4jCredentials = {
    connection: cryptoClient.encrypt(teamFields.neo4jCredentials.connection),
    auth: cryptoClient.encrypt(teamFields.neo4jCredentials.auth),
  }
  
  const modelProps = Object.assign({}, {
    name: teamFields.name,
    neo4jCredentials,
    imageURL: teamFields.imageURL,
    reportSets: []
  });

  return new Team(modelProps);
}

module.exports = {
  buildTeamModel,
  scrubTeamData,
  validateTeamFields
};
