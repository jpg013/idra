// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TwitterIntegrationJobSchema = new Schema({
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
    enum: ['pending', 'completed', 'error', 'inProgress'],
    default: 'pending'
  },
  statusMsg: { type: String, default: 'Waiting for Twitter Integration Job to start'},
  inProcess: { 
    name: { type: String },
    id: { type: String },
    TwitterID: { type: String }
  },
  neo4jCredentials: {
    connection: {type: String, required: true},
    auth: {type: String, required: true}
  }
});

TwitterIntegrationJobSchema.virtual('id').get(function() {
  return this._id.toString();
});

TwitterIntegrationJobSchema.virtual('teamId').get(function() {
  return this._teamId.toString();
});

TwitterIntegrationJobSchema.virtual('clientProps').get(function() {
  const {id, teamId, completedCount, status, statusMsg, inProcess } = this;
  const createdDate = this.createdTimestamp ? new Date(this.createdTimestamp) : undefined;
  const finishedDate = this.finishedTimestamp ? new Date(this.finishedTimestamp) : undefined;
  return { id, teamId, completedCount, status, statusMsg, inProcess, createdDate, finishedDate };
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('TwitterIntegrationJob', TwitterIntegrationJobSchema);


