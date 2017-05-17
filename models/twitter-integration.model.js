// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TwitterIntegrationSchema = new Schema({
  createdTimestamp: { type: Number, required: true },
  finishedTimestamp: { type: Number },
  _teamId: {type: mongoose.Schema.Types.ObjectId, required: true},
  completedCount: { type: Number, default: 0},
  totalCount: { type: Number, default: 0},
  userList: [{
    name: { type: String },
    id: { type: String },
    twitterID: { type: String },
    followers: [{
      twitterID: { type: String, required: true }
    }],
    friends: [{
      twitterID: { type: String, required: true }
    }]
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'error', 'inProgress', 'cancelled', 'cancelling'],
    default: 'pending'
  },
  statusMsg: { type: String, default: 'Waiting for Twitter Integration to start'},
  userInProgress: { 
    name: { type: String },
    id: { type: String },
    twitterID: { type: String }
  },
  neo4jCredentials: {
    connection: {type: String, required: true},
    auth: {type: String, required: true}
  },
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

TwitterIntegrationSchema.virtual('id').get(function() {
  return this._id.toString();
});

TwitterIntegrationSchema.virtual('teamId').get(function() {
  return this._teamId.toString();
});

TwitterIntegrationSchema.virtual('clientProps').get(function() {
  const {id, teamId, completedCount, status, statusMsg, userInProgress, createdTimestamp, finishedTimestamp, createdBy } = this;
  return { id, teamId, completedCount, status, statusMsg, userInProgress, createdTimestamp, finishedTimestamp, createdBy };
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('TwitterIntegration', TwitterIntegrationSchema);


