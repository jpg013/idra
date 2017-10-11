const consumeQueue   = require('./messageQueue/consumeQueue');
const createJob      = require('./createJob');
const runPendingJobs = require('./runPendingJobs');

const subscribeToJobQueue = () => {
  consumeQueue('new_alumni_import_jobs', msg => {
    let jobData;
    console.log('new data coming in', msg);
    try {
      jobData = JSON.parse(msg.content.toString());
    } catch(e) {
      return;
    }

    if (!jobData) {
      return;
    }

    console.log('receiving message', jobData);

    executeNewJobPipeline(jobData);
  });
}

const executeNewJobPipeline = jobData => {
  createJob(jobData, err => {
    if (err) {
      return;
    }
    runPendingJobs()
  });
}

module.exports = subscribeToJobQueue;
