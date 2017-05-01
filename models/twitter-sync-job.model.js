// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TwitterSyncJobSchema = new Schema({
  date: { type: Date, required: true, default: Date.now},
  completed: { type: Number, default: 0},
  teamId: {type: mongoose.Schema.Types.ObjectId, required: true},
  twitterCredentials: {
    consumer_key: {type: String, required: true},
    consumer_secret: {type: String, required: true},
    access_token_key: {type: String, required: true},
    access_token_secret: {type: String, required: true}
  },
  twitterData: [{
    name: { type: String },
    id: { type: String },
    TwitterID: { type: String }
  }],
  neo4jCredentials: {
    connection: {type: String, required: true},
    auth: {type: String, required: true}
  },
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
  status: { type: String, default: 'pending'},
  inProcess: { 
    name: { type: String },
    id: { type: String },
    TwitterID: { type: String }
  }
});

TwitterSyncJobSchema.virtual('id').get(function() {
  return this._id.toString();
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('TwitterSyncJob', TwitterSyncJobSchema);


