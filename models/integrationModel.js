const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IntegrationSchema = new Schema({
  type: { 
    type: String,
    enum: ['twitter', 'facebook', 'instagram'],
    default: 'twitter'
  },
  createdDate: { type: Date, required: true },
  finishedDate: { type: Date },
  teamId: {type: mongoose.Schema.Types.ObjectId, required: true},
  completedCount: { type: Number, default: 0},
  totalCount: { type: Number, default: 0},
  userList: [{
    name: { type: String },
    id: { type: String },
    mediaId: { type: String },
    followers: [{
      mediaId: { type: String, required: true }
    }],
    friends: [{
      mediaId: { type: String, required: true }
    }]
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'error', 'inProgress', 'cancelled'],
    default: 'pending'
  },
  statusMsg: { type: String, default: 'Waiting for integration to start'},
  userInProgress: { 
    name: { type: String },
    id: { type: String },
    mediaId: { type: String }
  },
  neo4jCredentials: {
    connection: {type: String, required: true},
    auth: {type: String, required: true}
  },
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

IntegrationSchema.virtual('id').get(function() {
  return this._id.toString();
});

IntegrationSchema.virtual('team').get(function() {
  return this.teamId.toString();
});

IntegrationSchema.virtual('clientProps').get(function() {
  const {id, teamId, completedCount, totalCount, status, statusMsg, userInProgress, createdDate, finishedDate, createdBy } = this;
  return { id, teamId, completedCount, totalCount, status, statusMsg, userInProgress, createdDate, finishedDate, createdBy };
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Integration', IntegrationSchema);


