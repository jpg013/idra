const IntegrationModel = require('../models/integrationModel');

function validateIntegrationFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.teamId ||
      !fields.createdById ||
      !fields.createdByName ||
      !fields.type ||
      !fields.userList ||
      !fields.socialMediaCredential ||
      !fields.totalCount
     ) { return false; }
  return true;
}

function scrubIntegrationData(data) {
  if (!data || typeof data !== 'object') return {};
  const { teamId, createdById, createdByName, type, userList, socialMediaCredential, totalCount } = data;
  return {
    teamId,
    createdById,
    createdByName,
    type,
    userList,
    socialMediaCredential,
    totalCount
  };
}

function buildIntegrationModel(fields) {
  const { teamId, createdById, createdByName, type, userList, socialMediaCredential, totalCount } = fields;
  
  const props = {
    teamId,
    createdById,
    createdByName,
    type,
    userList,
    socialMediaCredential,
    totalCount
  };

  return new IntegrationModel(props);
}

module.exports = {
  buildIntegrationModel,
  scrubIntegrationData,
  validateIntegrationFields
};
