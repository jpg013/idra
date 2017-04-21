// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  name: String,
  createdDate: Date,
  createdBy: String,
  createdById: String,
  description: String,
  query: String,
  groupId: mongoose.Schema.Types.ObjectId,
  teamId: mongoose.Schema.Types.ObjectId,
  teamName: String,
  downloadCount: Number
});

ReportSchema.virtual('id').get(function() {
  return this._id.toString();
});

ReportSchema.virtual('clientProps').get(function() {
  const {name, createdDate, description, query, groupId, teamId, teamName, id, createdBy, createdById, downloadCount} = this;
  return {name, createdDate, description, query, groupId, teamId, teamName, id, createdBy, createdById, downloadCount};
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Report', ReportSchema);


