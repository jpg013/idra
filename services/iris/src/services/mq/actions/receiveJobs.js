const consumer       = require('../consumer');
const createJob      = require('../../jobs/createJob');
const runPendingJobs = require('../../jobs/runPendingJobs');

const onJobReceive = (msg, ch) => {
  console.log(JSON.parse(msg.content.toString()))
  console.log(msg.fields.routingKey);
  return;
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
      // Do not ack msg if err
      ch.ack(msg);
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
