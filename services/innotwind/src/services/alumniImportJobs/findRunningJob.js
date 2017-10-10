const findOne      = require('../../db/institutions/findOne');
const makeObjectId = require('../../db/makeObjectId');

const findRunningJob = (institutionId, cb) => {
  const $query = { 
    _id: makeObjectId(institutionId),
    alumniImportJobs : {
      $elemMatch : { 
        status: { 
          $in: ['pending', 'inProgress']
        } 
      }
    }
  };
  findOne($query, cb);
};

module.exports = findRunningJob;