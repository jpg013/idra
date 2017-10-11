const makeInsertProps = require('../db/jobs/makeInsertProps');
const insertOne       = require('../db/jobs/insertOne');

const createJob = (jobData, cb) => {
  const { ticket, subscriptionKey, jobID } = jobData;

  if (!ticket || !subscriptionKey || !jobID) {
    console.log("why the fuck don't we have this!!");
    return cb();
  }

  const $insert = makeInsertProps(jobData);

  insertOne($insert, cb)
};

module.exports = createJob;
