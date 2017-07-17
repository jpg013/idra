const TwitterCredential = require('../models/twitterCredentialModel');
const cryptoClient = require('../common/crypto');

function validateTwitterCredentialFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.consumerKey ||
      !fields.consumerSecret ||
      !fields.accessTokenKey ||
      !fields.accessTokenSecret ||
      !fields.teamId
     ) { return false; }
  return true;
}

function scrubTwitterCredentialData(data) {
  if (!data || typeof data !== 'object') return {};
  const { accessTokenSecret, accessTokenKey, consumerSecret, consumerKey, teamId } = data;
  return {
    accessTokenSecret: accessTokenSecret,
    accessTokenKey: accessTokenKey,
    consumerSecret: consumerSecret,
    consumerKey: consumerKey,
    teamId
  };
}

function buildTwitterCredentialModel(fields) {
  const { consumerSecret, consumerKey, accessTokenKey, accessTokenSecret, teamId } = fields;
  const props = {
    consumerKey: cryptoClient.encrypt(consumerKey),
    consumerSecret: cryptoClient.encrypt(consumerSecret),
    accessTokenKey: cryptoClient.encrypt(accessTokenKey),
    accessTokenSecret: cryptoClient.encrypt(accessTokenSecret),
    teamId
  };
  return new TwitterCredential(props);
}

module.exports = {
  buildTwitterCredentialModel,
  scrubTwitterCredentialData,
  validateTwitterCredentialFields
};
