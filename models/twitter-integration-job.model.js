// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TwitterIntegrationJobSchema = new Schema({
  date: { type: Date, required: true, default: Date.now},
  teamId: {type: mongoose.Schema.Types.ObjectId, required: true},
  completed: { type: Number, default: 0},
  userList: [{
    name: { type: String },
    id: { type: String },
    twitterID: { type: String },
    followers: [ { type: String }],
    friends: [{
      twitterID: { type: String, required: true }
    }]
  }],
  status: { type: String, default: 'pending'},
  inProcess: { 
    name: { type: String },
    id: { type: String },
    TwitterID: { type: String }
  },
  neo4jCredentials: {
    connection: {type: String, required: true},
    auth: {type: String, required: true}
  },
});

TwitterIntegrationJobSchema.virtual('id').get(function() {
  return this._id.toString();
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('TwitterIntegrationJob', TwitterIntegrationJobSchema);


