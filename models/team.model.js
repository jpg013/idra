const mongoose         = require('mongoose');
const Schema           = mongoose.Schema;
const Report           = require('./report.model');
const ReportGroup      = require('./report-group.model');
const immutable        = require('immutable');

const teamSchema = new Schema({
  name              : String,
  reports           : [Report.schema],
  reportGroups      : [ReportGroup.schema],
  createdDate       : Date,
  userCount         : Number,
  neo4jConnection   : String,
  neo4jAuth         : String,
  lastActivityDate  : Date,
  imageURL          : String,
  downloadCount     : Number
});

/**
 * Methods
 */
teamSchema.methods.findReport = function(reportId) {
  return this.reports.find(cur => cur.id === reportId);
}

/**
 * Schema
 */

teamSchema.virtual('id').get(function() {
  return this._id.toString();
});

teamSchema.virtual('clientProps').get(function() {
  const  { name,  createdDate, userCount, id, downloadCount, imageURL, lastActivityDate } = this;
  const reports = this.reports.map(cur => cur.clientProps);
  const reportGroups = this.reportGroups.map(cur => cur.clientProps);
  return { name,  reports, createdDate, userCount, reportGroups, id, downloadCount, imageURL, lastActivityDate };
})

module.exports = mongoose.model('Team', teamSchema);
