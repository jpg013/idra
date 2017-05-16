const TwitterIntegrationJobModel = require('../models/twitter-integration-job.model');
const cryptoClient               = require('../common/crypto');

function validateTwitterIntegrationFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.userList ||
      !fields.neo4jCredentials ||
      (typeof fields.neo4jCredentials !== 'object') ||
      !fields.neo4jCredentials.auth ||
      !fields.neo4jCredentials.connection ||
      !fields._teamId
     ) { return false; }
  return true;
}

function scrubTwitterIntegrationData(data) {
  if (!data || typeof data !== 'object') return {};
  const { teamId, neo4jCredentials, userList } = data;
  return {
    _teamId: teamId, 
    neo4jCredentials,
    userList
  }
}

function buildTwitterIntegrationJobModel(fields) {
  const { _teamId, neo4jCredentials, userList } = fields;
  
  const props = {
    neo4jCredentials,
    _teamId,
    userList,
    createdTimestamp: new Date().getTime(),
    totalCount: userList.length
  };  

  return new TwitterIntegrationJobModel(props);
}

module.exports = {
  buildTwitterIntegrationJobModel,
  scrubTwitterIntegrationData,
  validateTwitterIntegrationFields
};