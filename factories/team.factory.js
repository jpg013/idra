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
    consumerKey: '',
    consumerSecret: '',
    accessTokenKey: '',
    accessTokenSecret: ''
  };
  
  if (!twitterCreds || typeof twitterCreds !== 'object') return defaultTwitterCreds;
  const { consumerSecret, consumerKey, accessTokenKey, accessTokenSecret} = twitterCreds;
  if (!consumerSecret || 
      typeof consumerSecret !== 'string' || 
      consumerSecret.length < 5 ||
      !consumerKey ||
      typeof consumerKey !== 'string' ||
      consumerKey.length < 5 ||
      !accessTokenKey ||
      typeof accessTokenKey !== 'string' ||
      accessTokenKey.length < 5 ||
      !accessTokenSecret ||
      typeof accessTokenSecret !== 'string' ||
      accessTokenSecret.length < 5 
      ) { return defaultTwitterCreds; }
  
  return {
    consumerKey: cryptoClient.encrypt(consumerKey),
    consumerSecret: cryptoClient.encrypt(consumerSecret),
    accessTokenKey: cryptoClient.encrypt(accessTokenKey),
    accessTokenSecret: cryptoClient.encrypt(accessTokenSecret)
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