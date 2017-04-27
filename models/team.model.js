const mongoose           = require('mongoose');
const Schema             = mongoose.Schema;
const ReportGroup        = require('./report-group.model');
const TwitterCredentials = require('./twitter-credentials.model');
const immutable          = require('immutable');

const teamSchema = new Schema({
  name               : {type: String, required: true},
  reportCollection   : [ReportGroup.schema],
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
teamSchema.methods.findReport = function(reportGroupId, reportId) {
  const reportGroupModel = this.reportCollection.find(cur => cur.id === reportGroupId);
  if (!reportGroupModel) return;
  return reportGroupModel.reports.find(cur => cur.id === reportId);
}

/**
 * Schema
 */
teamSchema.virtual('id').get(function() {
  return this._id.toString();
});

teamSchema.virtual('downloadCount').get(function() {
  return this.reportCollection.reduce((acc, cur) => {
    return acc + cur.reports.reduce((acc, cur) => {
      return acc + cur.downloadCount;
    }, 0);
  }, 0);
});

teamSchema.virtual('clientProps').get(function() {
  const  { name,  createdDate, userCount, id, downloadCount, imageURL, lastActivityDate } = this;
  const reportCollection = this.reportCollection.map(cur => cur.clientProps);
  return { name, reportCollection, createdDate, userCount, id, downloadCount, imageURL, lastActivityDate };
})

module.exports = mongoose.model('Team', teamSchema);
