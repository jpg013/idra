const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlumniIntegrationSchema = new Schema({
  type: { 
    type: String,
    enum: ['twitter', 'facebook', 'instagram'],
    default: 'twitter'
  },
  createdDate: { type: Date, required: true, default: Date.now },
  finishedDate: { type: Date },
  institutionId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Institution'},
  completedCount: { type: Number, default: 0},
  totalCount: { type: Number, default: 0},
  alumniList: [{
    name: { type: String },
    id: { type: String },
    hasBeenSynced: { type: Boolean, default: false },
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'error', 'inProgress', 'cancelled'],
    default: 'pending'
  },
  statusMsg: { type: String, default: 'Waiting for integration to start.'},
  alumniInProgress: { 
    name: { type: String },
    id: { type: String },
    mediaId: { type: String }
  },
  integrationCredentials: { type: Object, required: true },
  createdById: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdByName: { type: String, required: true },
});

AlumniIntegrationSchema.virtual('id').get(function() {
  return this._id.toString();
});

AlumniIntegrationSchema.virtual('team').get(function() {
  return this.teamId.toString();
});

Z.virtual('clientProps').get(function() {
  const {id, type, teamId, completedCount, totalCount, status, statusMsg, userInProgress, createdDate, finishedDate, createdById, createdByName } = this;
  return { 
    id, 
    type,
    teamId, 
    completedCount, 
    totalCount, 
    status, 
    statusMsg, 
    userInProgress, 
    createdDate, 
    finishedDate, 
    createdById,
    createdByName 
  };
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Integration', IntegrationSchema);


