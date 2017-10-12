const encrypt = require('../../helpers/encrypt');

const makeInsertProps = data => {
  const { name, neo4jConnection, neo4jAuth, blackbaudClientId, blackbaudClientSecret, blackbaudSubscriptionKey } = data;

  return {
    name,
    neo4jConnection: encrypt(neo4jConnection),
    neo4jAuth: encrypt(neo4jAuth),
    userCount: 0,
    createdDate: new Date(),
    reports: [],
    alumniImportJobs: [],
    enrichmentJobs: [],
    blackBaudCredentials: {
      ticket: undefined,
      state: encrypt(name),
      clientId: encrypt(blackbaudClientId),
      clientSecret: encrypt(blackbaudClientSecret),
      subscriptionKey: encrypt(blackbaudSubscriptionKey)
    }
  };
}

module.exports = makeInsertProps;
