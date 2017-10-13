const consumer       = require('../consumer');
const createJob      = require('../../jobs/createJob');
const runPendingJobs = require('../../jobs/runPendingJobs');

const onJobReceive = (msg, ch) => {
  let jobData;

  try {
    jobData = JSON.parse(msg.content.toString());
  } catch(e) {
    return;
  }

  if (!jobData) {
    return;
  }

  createJob(jobData, err => {
    if (!err) {
      runPendingJobs()
    }
  });
}

const receiveJobs = () => {
  const consumerOpts = {
    exchange: 'institution_constituents',
    bindingType: 'direct',
    q: '',
    exchangeOpts: { durable: false },
    queueOpts: { },
    routingKey: 'run_constituent_import'
  };

  consumer(consumerOpts, onJobReceive);
}

module.exports = receiveJobs;
