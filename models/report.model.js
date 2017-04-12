// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  name: String,
  createdDate: Date,
  createdBy: String,
  description: String,
  query: String,
  groupName: String,
  downloadCount: Number,
  teamId: mongoose.Schema.Types.ObjectId
});

ReportSchema.virtual('id').get(function() {
  return this._id.toString();
});

ReportSchema.virtual('clientProps').get(function() {
  const {name, createdDate, description, query, groupName, id, createdBy, teamId} = this;
  return {name, createdDate, description, query, groupName, id, createdBy, teamId};
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Report', ReportSchema);


