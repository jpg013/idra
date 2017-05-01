const Team         = require('../models/team.model');
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
  const { name, neo4jCredentials, imageURL, twitterCredentials } = data;
  return {
    name, 
    neo4jCredentials,
    twitterCredentials,
    imageURL
  };
}

function tryToBuildTwitterCredentials(twitterCreds) {
  const defaultTwitterCreds = {
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
  };
  if (!twitterCreds || typeof twitterCreds !== 'object') return defaultTwitterCreds;
  const { consumer_secret, consumer_key, access_token_key, access_token_secret} = twitterCreds;
  if (!consumer_secret || 
      typeof consumer_secret !== 'string' || 
      consumer_secret.length < 5 ||
      !consumer_key ||
      typeof consumer_key !== 'string' ||
      consumer_key.length < 5 ||
      !access_token_key ||
      typeof access_token_key !== 'string' ||
      access_token_key.length < 5 ||
      !access_token_secret ||
      typeof access_token_secret !== 'string' ||
      access_token_secret.length < 5 
      ) { return defaultTwitterCreds; }
  
  return {
    consumer_key: cryptoClient.encrypt(consumer_key),
    consumer_secret: cryptoClient.encrypt(consumer_secret),
    access_token_key: cryptoClient.encrypt(access_token_key),
    access_token_secret: cryptoClient.encrypt(access_token_secret)
  }
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
    reportSets: [],
    reports: [],
    twitterCredentials: tryToBuildTwitterCredentials(teamFields.twitterCredentials)
  });

  return new Team(modelProps);
}

module.exports = {
  buildTeamModel,
  scrubTeamData,
  validateTeamFields
};