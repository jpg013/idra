const makeInsertProps  = require('../../db/jobs/makeInsertProps');
const insertOne        = require('../../db/jobs/insertOne');
const checkIfJobExists = require('./checkIfJobExists');

const createJob = (jobData, cb) => {
  const { ticket, subscriptionKey, jobID } = jobData;

  if (!ticket || !subscriptionKey || !jobID || !subscriptionKey || !jobID) {
    return cb('Invalid job data.');
  }

  checkIfJobExists(jobID, (err, exists) => {
    if (err) {
      return cb(err);
    }

    if (exists) {
      return cb('Job with id already exists');
    }

    insertOne(makeInsertProps(jobData), cb)
  });
};

module.exports = createJob;
