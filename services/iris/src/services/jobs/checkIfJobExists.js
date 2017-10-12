const findOne      = require('../../db/jobs/findOne');
const makeObjectId = require('../../db/makeObjectId');

const checkIfJobExists = (jobID, cb) => {
  const $query = { jobID: makeObjectId(jobID) };
  findOne($query, (err, result) => cb(err, result ? true : false));
};

module.exports = checkIfJobExists;
