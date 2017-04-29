const mongoose           = require('mongoose');
const Schema             = mongoose.Schema;
const ReportSet          = require('./report-set.model');
const Report             = require('./report.model');

const teamSchema = new Schema({
  name               : {type: String, required: true},
  reports            : [Report.schema],
  reportSets         : [ReportSet.schema],
  createdDate        : {type: Date, default: Date.now},
  userCount          : {type: Number, default: 0},
  lastActivityDate   : {type: Date},
  imageURL           : {type: String},
  twitterCredentials : {
    consumerKey: {type: String},
    consumerSecret: {type: String},
    accessTokenKey: {type: String},
    accessTokenSecret: {type: String},
  },
  neo4jCredentials : {
    connection: {type: String, required: true},
    auth: {type: String, required: true}
  }
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

teamSchema.virtual('downloadCount').get(function() {
  return this.reports.reduce((acc, cur) => {
    return acc + cur.downloadCount;
  }, 0)
});

teamSchema.virtual('reportCollection').get(function() {
  return this.reportSets.map(set => {
    set = set.clientProps;
    set.teamName = this.name;
    const reports = this.reports.filter(cur => cur.reportSetId.toString() === set.id).map(cur => cur.clientProps);
    set.reports = reports;
    return set;
  });
});

teamSchema.virtual('reportCount').get(function() {
  return this.reports.length;
});

teamSchema.virtual('collectionCount').get(function() {
  return this.reportSets.length;
});

teamSchema.virtual('clientProps').get(function() {
  const { name, createdDate, userCount, lastActivityDate, imageURL, downloadCount, reportCount, collectionCount, id, reportCollection } = this;
  return { name, createdDate, userCount, lastActivityDate, imageURL, downloadCount, reportCollection, reportCount, collectionCount, id };
})

module.exports = mongoose.model('Team', teamSchema);
