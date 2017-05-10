// get an instance of mongoose and mongoose.Schema
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const CryptoClient = require('../common/crypto');

const TwitterCredentialSchema = new Schema({
  consumer_key: { type: String, required: true },
  consumer_secret: { type: String, required: true },
  access_token_key: { type: String, required: true },
  access_token_secret: { type: String, required: true },
  teamId: {type: mongoose.Schema.Types.ObjectId, required: true},
  lockedUntil: { type: Number }
});

TwitterCredentialSchema.virtual('id').get(function() {
  return this._id.toString();
});

TwitterCredentialSchema.virtual('persistProps').get(function() {
  const { consumer_key, consumer_secret, access_token_key, access_token_secret, teamId } = this;
  return { consumer_key, consumer_secret, access_token_key, access_token_secret, teamId };
});

TwitterCredentialSchema.virtual('clientProps').get(function() {
  const { consumer_key, consumer_secret, access_token_key, access_token_secret, teamId } = this;
  return { 
    consumer_key: CryptoClient.decrypt(consumer_key),
    consumer_secret: CryptoClient.decrypt(consumer_secret),
    access_token_key: CryptoClient.decrypt(access_token_key),
    access_token_secret: CryptoClient.decrypt(access_token_secret),
    teamId 
  };
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('TwitterCredential', TwitterCredentialSchema);