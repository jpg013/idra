// get an instance of mongoose and mongoose.Schema
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const cryptoClient = require('../common/crypto');

const TwitterCredentialSchema = new Schema({
  consumerKey: { type: String, required: true },
  consumerSecret: { type: String, required: true },
  accessTokenKey: { type: String, required: true },
  accessTokenSecret: { type: String, required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId }
});

TwitterCredentialSchema.virtual('id').get(function() {
  return this._id.toString();
});

TwitterCredentialSchema.virtual('clientProps').get(function() {
  const { consumerKey, consumerSecret, accessTokenKey, accessTokenSecret, teamId } = this;
  if (!consumerKey || !consumerSecret || !accessTokenKey || !accessTokenSecret) {
    return;
  }
  return { 
    consumerKey: cryptoClient.decrypt(consumerKey),
    consumerSecret: cryptoClient.decrypt(consumerSecret),
    accessTokenKey: cryptoClient.decrypt(accessTokenKey),
    accessTokenSecret: cryptoClient.decrypt(accessTokenSecret),
    teamId
  };
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('TwitterCredential', TwitterCredentialSchema);