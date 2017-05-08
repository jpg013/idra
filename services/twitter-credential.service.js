const TwitterCredentialFactory = require('../factories/twitter-credential.factory');
const TwitterCredentialModel   = require('../models/twitter-credential.model');

const getTwitterCredential = (teamId, cb) => TwitterCredentialModel.findOne({teamId}, cb);

const updateTwitterCredential = (data = {}, cb) => {
  const fields = TwitterCredentialFactory.scrubTwitterCredentialData(data);
  if (!TwitterCredentialFactory.validateTwitterCredentialFields(fields)){
    return cb('missing required twitter credential data');
  }

  const $query = { teamId: fields.teamId };
  const $update = { $set: fields };
  const $opts = { upsert: true };
  TwitterCredentialModel.update($query, $update, $opts, err => cb(err));
}

module.exports = {
  getTwitterCredential,
  updateTwitterCredential
}