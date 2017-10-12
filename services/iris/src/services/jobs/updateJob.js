const encrypt = require('../../helpers/encrypt');
const findOneAndUpdate = require('../../db/jobs/findOneAndUpdate');

// Setters
const makeUpdateSetter = (setter={}, key, val) => {
  if (!setter.$set) {
    setter.$set = {}
  }
  setter.$set[key] = val;
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
      default:
        makeUpdateSetter(acc, cur, fields[cur]);
    }
  }, {});
}

const updateJob = (id, fields, cb) => {
  const $update = {'$set' : { ...fields } };
  findOneAndUpdate(id, $update, cb);
}

module.exports = updateJob;
