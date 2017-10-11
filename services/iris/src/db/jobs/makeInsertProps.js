const encrypt = require('../../helpers/encrypt');

const makeInsertProps = data => {
  console.log(data);
  const { ticket, subscriptionKey, JobID } = data;

  return {
    ticket: encrypt(JSON.stringify(ticket)),
    subscriptionKey: encrypt(subscriptionKey),
    status: 'pending',
    totalCount: 0,
    completedCount: 0,
    errors: [],
    cursor: 0,
    jobID
  };
}

module.exports = makeInsertProps;
