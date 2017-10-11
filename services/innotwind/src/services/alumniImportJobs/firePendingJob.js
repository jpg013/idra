const getById        = require('../institutions/getById');
const sendToQueue = require('../messageQueue/sendToQueue');

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
    const { ticket, subscriptionKey } = institution.blackBaudCredentials;
    
    const msg = {
      ticket,
      subscriptionKey,
      jobID: jobID.toString()
    };

    sendToQueue('new_alumni_import_jobs', msg);
  });
};

module.exports = firePendingJob;