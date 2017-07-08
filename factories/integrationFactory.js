const IntegrationModel = require('../models/integration.model');

function validateIntegrationFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.userList ||
      !fields.neo4jCredentials ||
      (typeof fields.neo4jCredentials !== 'object') ||
      !fields.neo4jCredentials.auth ||
      !fields.neo4jCredentials.connection ||
      !fields.teamId ||
      !fields.createdBy
     ) { return false; }
  return true;
}

function scrubIntegrationData(data) {
  if (!data || typeof data !== 'object') return {};
  const { teamId, neo4jCredentials, userList, createdBy, type } = data;
  return {
    teamId, 
    neo4jCredentials,
    userList,
    createdBy,
    type
  }
}

function buildIntegrationModel(fields) {
  const { teamId, neo4jCredentials, userList, createdBy, type } = fields;
  
  const props = {
    neo4jCredentials,
    teamId,
    userList,
    createdBy,
    type,
    createdTimestamp: new Date().getTime(),
    totalCount: userList.length
  };  

  return new IntegrationModel(props);
}

module.exports = {
  buildIntegrationModel,
  scrubIntegrationData,
  validateIntegrationFields
};