const encrypt          = require('../../helpers/encrypt');
const findOneAndUpdate = require('../../db/jobs/findOneAndUpdate');
const findById         = require('../../db/jobs/findById');

// Setters
const makeUpdateSetter = (setter={}, key, val) => {
  if (!setter.$set) {
    setter.$set = {}
  }
  setter.$set[key] = val;
  return setter;
}

const incCompletedCount = (setter={}, val) => {
  if (!setter.$inc) {
    setter.$inc = {};
  }
  setter.$inc.completedCount = val;
  return setter;
}

const buildUpdateObj = (fields={}) => {
  return Object.keys(fields).reduce((acc, cur) => {
    switch(cur) {
      case 'ticket':
      case 'subscriptionKey':
      case 'clientId':
      case 'clientSecret':
        return makeUpdateSetter(acc, cur, encrypt(fields[cur]));
      case 'completedCount':
        return incCompletedCount(acc, fields[cur]);
      default:
        makeUpdateSetter(acc, cur, fields[cur]);
    }
  }, {});
}

const updateJob = (id, fields, cb) => {
  const $update = {'$set' : { ...fields } };
  findOneAndUpdate(id, $update, err => {
    if (err) {
      return cb(err);
    }
    findById(id, cb);
  });
}

module.exports = updateJob;
