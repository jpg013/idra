const decrypt = require('../../helpers/decrypt');

const baseProps = {
  ticket: undefined,
  subscriptionKey: undefined,
  status: 'pending',
  totalCount: 0,
  completedCount: 0,
  errors: [],
  nextLink: ''
};

const mapClientProps = data => {
  if (!data) {
    return {};
  }

  const { ticket, subscriptionKey, status, totalCount, completedCount, errors, jobID, nextLink, clientId, clientSecret, _id } = data;

  return {
    ticket: JSON.parse(decrypt(ticket)),
    subscriptionKey: decrypt(subscriptionKey),
    clientId: decrypt(clientId),
    clientSecret: decrypt(clientSecret),
    status,
    totalCount,
    completedCount,
    errors,
    jobID: jobID.toString(),
    nextLink,
    id: _id.toString()
  }
};

module.exports = mapClientProps;
