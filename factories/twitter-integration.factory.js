const TwitterIntegrationModel = require('../models/twitter-integration.model');
const cryptoClient            = require('../common/crypto');

function validateTwitterIntegrationFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.userList ||
      !fields.neo4jCredentials ||
      (typeof fields.neo4jCredentials !== 'object') ||
      !fields.neo4jCredentials.auth ||
      !fields.neo4jCredentials.connection ||
      !fields._teamId ||
      !fields.createdBy
     ) { return false; }
  return true;
}

function scrubTwitterIntegrationData(data) {
  if (!data || typeof data !== 'object') return {};
  const { teamId, neo4jCredentials, userList, createdBy } = data;
  return {
    _teamId: teamId, 
    neo4jCredentials,
    userList,
    createdBy
  }
}

function buildTwitterIntegrationModel(fields) {
  const { _teamId, neo4jCredentials, userList, createdBy } = fields;
  
  const props = {
    neo4jCredentials,
    _teamId,
    userList,
    createdBy,
    createdTimestamp: new Date().getTime(),
    totalCount: userList.length
  };  

  return new TwitterIntegrationModel(props);
}

module.exports = {
  buildTwitterIntegrationModel,
  scrubTwitterIntegrationData,
  validateTwitterIntegrationFields
};