const encrypt = require('../../helpers/encrypt');
const decrypt = require('../../helpers/decrypt');

const baseProps = {
  name: '',
  neo4jConnection: '',
  neo4jAuth: '',
  blackBaudCredentials: {
    ticket: undefined,
    state: undefined,
    expires: undefined,
    clientId: undefined,
    clientSecret: undefined,
    subscriptionKey: undefined
  },
  userCount: 0,
  reports: [],
  alumniImportJobs: [],
  enrichmentJobs: [],
  createdDate: new Date(),
  lastActivityDate: undefined,
};

const mapClientProps = data => {
  if (!data) {
    return {};
  }

  const {
    name, neo4jConnection, neo4jAuth,
    blackBaudCredentials, userCount, reports, alumniImportJobs,
    enrichmentJobs, createdDate, lastActivityDate, _id: id
  } = data;

  return {
    name: name || baseProps.name,
    neo4jConnection: neo4jConnection || baseProps.neo4jConnection,
    neo4jAuth: neo4jAuth || baseProps.neo4jAuth,
    userCount: userCount || baseProps.userCount,
    reports: reports || baseProps.reports,
    alumniImportJobs: alumniImportJobs || baseProps.alumniImportJobs,
    enrichmentJobs: enrichmentJobs || baseProps.enrichmentJobs,
    createdDate: createdDate || baseProps.createdDate,
    lastActivityDate: lastActivityDate || baseProps.lastActivityDate,
    blackBaudCredentials: {
      ticket: blackBaudCredentials ? blackBaudCredentials.ticket : baseProps.blackBaudCredentials.ticket,
      state: blackBaudCredentials ? blackBaudCredentials.state : baseProps.blackBaudCredentials.state,
      expires: blackBaudCredentials ? blackBaudCredentials.expires : baseProps.blackBaudCredentials.expires,
      clientId: (blackBaudCredentials && blackBaudCredentials.clientId) ? decrypt(blackBaudCredentials.clientId) : baseProps.blackBaudCredentials.clientId,
      clientSecret: (blackBaudCredentials && blackBaudCredentials.clientSecret) ? decrypt(blackBaudCredentials.clientSecret) : baseProps.blackBaudCredentials.clientSecret,
      subscriptionKey: (blackBaudCredentials && blackBaudCredentials.subscriptionKey) ? decrypt(blackBaudCredentials.subscriptionKey) : baseProps.blackBaudCredentials.subscriptionKey
    },
    id
  }

};

module.exports = mapClientProps;
