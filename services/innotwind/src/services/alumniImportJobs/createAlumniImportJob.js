const findOneAndUpdate = require('../../db/institutions/findOneAndUpdate');
const findRunningJob   = require('./findRunningJob');
const makeObjectId     = require('../../db/makeObjectId');

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
      msg: '',
      status: 'pending',
      totalCount: 0,
      completedCount: 0,
      jobID: makeObjectId()
    };
    
    const $update = { '$push': { 'alumniImportJobs': alumniImportJob }}
    findOneAndUpdate(institutionId, $update, cb);  
  });
};

module.exports = createAlumniImportJob;