const encrypt = require('../../helpers/encrypt');
const decrypt = require('../../helpers/decrypt');

const baseProps = {
  ticket: undefined,
  subscriptionKey: undefined,
  status: 'pending',
  totalCount: 0,
  completedCount: 0,
  errors: [],
  cursor: 0
};

const mapClientProps = data => {
  if (!data) {
    return {};
  }

  const { ticket, subscriptionKey, status, totalCount, completedCount, errors, cursor, jobID } = data;

  return {
    ticket: decrypt(ticket),
    subscriptionKey: decrypt(subscriptionKey),
    status,
    totalCount,
    completedCount,
    errors,
    cursor,
    jobID
  }
};

module.exports = mapClientProps;
