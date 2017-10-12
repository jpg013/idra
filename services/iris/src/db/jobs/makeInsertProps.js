const encrypt      = require('../../helpers/encrypt');
const makeObjectId = require('../makeObjectId');

const makeInsertProps = data => {
  const { ticket, subscriptionKey, jobID, clientId, clientSecret } = data;

  return {
    ticket: encrypt(JSON.stringify(ticket)),
    subscriptionKey: encrypt(subscriptionKey),
    clientId: encrypt(clientId),
    clientSecret: encrypt(clientSecret),
    status: 'pending',
    totalCount: 0,
    completedCount: 0,
    errors: [],
    jobID: makeObjectId(jobID),
    nextLink: 'https://api.sky.blackbaud.com/constituent/v1/constituents'
  };
}

module.exports = makeInsertProps;
