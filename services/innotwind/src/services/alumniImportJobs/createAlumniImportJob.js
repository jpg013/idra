const findOneAndUpdate = require('../../db/institutions/findOneAndUpdate');
const findRunningJob   = require('./findRunningJob');

const createAlumniImportJob = (institutionId, cb) => {
  findRunningJob(institutionId, (err, result) => {
    if (err) {
      return cb(err);
    }

    if (result) {
      return cb('An alumni import job is already running');
    }

    const alumniImportJob = {
      createdDate: new Date(),
      error: '',
      status: 'pending',
      totalCount: 0,
      completedCount: 0
    };
    
    const $update = { '$push': { 'alumniImportJobs': alumniImportJob }}
    findOneAndUpdate(institutionId, $update, cb);  
  });
};

module.exports = createAlumniImportJob;