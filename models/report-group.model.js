// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema      = mongoose.Schema;
const ReportModel = require('./report.model');

const ReportGroupSchema = new Schema({
  name: String,
  createdDate: Date,
  createdBy: String,
  createdById: mongoose.Schema.Types.ObjectId,
  teamId: mongoose.Schema.Types.ObjectId,
  teamName: String,
  reports: [ReportModel.schema]
});

ReportGroupSchema.virtual('id').get(function() {
  return this._id.toString();
});

ReportGroupSchema.virtual('clientProps').get(function() {
  const { name, createdDate, createdBy, createdById, id, teamName, teamId } = this;
  const reports = this.reports.map(cur => cur.clientProps);
  return { name, createdDate, createdBy, createdById, id, teamName, teamId, reports };
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('ReportGroup', ReportGroupSchema);


