// get an instance of mongoose and mongoose.Schema
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const cryptoClient = require('../common/crypto');

const TwitterCredentialSchema = new Schema({
  consumer_key: { type: String, required: true },
  consumer_secret: { type: String, required: true },
  access_token_key: { type: String, required: true },
  access_token_secret: { type: String, required: true },
  lockedUntil: { type: Number }
});

TwitterCredentialSchema.virtual('id').get(function() {
  return this._id.toString();
});

TwitterCredentialSchema.virtual('persistProps').get(function() {
  const { consumer_key, consumer_secret, access_token_key, access_token_secret} = this;
  return { consumer_key, consumer_secret, access_token_key, access_token_secret };
});

TwitterCredentialSchema.virtual('clientProps').get(function() {
  const { consumer_key, consumer_secret, access_token_key, access_token_secret} = this;
  return { 
    consumer_key: cryptoClient.decrypt(consumer_key),
    consumer_secret: cryptoClient.decrypt(consumer_secret),
    access_token_key: cryptoClient.decrypt(access_token_key),
    access_token_secret: cryptoClient.decrypt(access_token_secret)
  };
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('TwitterCredential', TwitterCredentialSchema);