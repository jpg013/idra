const getById        = require('../institutions/getById');
const publisher      = require('../mq/publisher');

const firePendingJob = institutionId => {
  getById(institutionId, (err, institution) => {
    if (err || !institution) {
      return;
    }

    const pendingJob = institution.alumniImportJobs.find(cur => cur.status === 'pending');
    if (!pendingJob) {
      return;
    }

    const { jobID } = pendingJob;
    const { blackBaudCredentials } = institution;
    
    const msg = {
      ...blackBaudCredentials,
      jobID: jobID.toString()
    };

    const publishOpts = {
      q: 'new_alumni_import_jobs',
      assertOpts: { durable: true },
      sendOpts: { persistent: true },
      msg
    };
    
    const onDone = (err, ok) => {
      console.log('fuck ya');
      console.log(err);
      console.log(ok);
    }
    
    publisher(publishOpts, onDone);
  });
};

module.exports = firePendingJob;