// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TwitterCredentialSchema = new Schema({
  consumer_key: { type: String, required: true },
  consumer_secret: { type: String, required: true },
  access_token_key: { type: String, required: true },
  access_token_secret: { type: String, required: true },
  teamId: {type: mongoose.Schema.Types.ObjectId, required: true},
  rateLimit: {
    friends: {
      remaining: { type: Number },
      reset: { type: Number }
    },
    followers: {
      remaining: { type: Number },
      reset: { type: Number }
    }
  },
  isPublic: { type: Boolean, default: false },
  lastUsedTimestamp: { type: Number, default: 0 },
  inUse: {type: Boolean, default: false } 
});

TwitterCredentialSchema.virtual('id').get(function() {
  return this._id.toString();
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('TwitterCredential', TwitterCredentialSchema);