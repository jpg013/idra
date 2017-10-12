const getById    = require('../../institutions/getById');
const getChannel = require('../publisher');

const emitConstituentImportJob = (institutionId) => {
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

    const args = {
      exchange: 'institution_constituents',
      bindingType: 'direct',
      routingKey: 'run_constituent_import',
      msg
    };
    
    publisher(args);
  });
};

module.exports = emitConstituentImportJob;