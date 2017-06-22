const mongoose           = require('mongoose');
const Schema             = mongoose.Schema;
const ReportSet          = require('./report-set.model');
const TwitterCredential  = require('./twitter-credential.model');
const Integration        = require('./integration.model');

const teamSchema = new Schema({
  name                  : {type: String, required: true},
  reportSets            : [ ReportSet.schema ],
  createdDate           : {type: Date, default: Date.now},
  userCount             : {type: Number, default: 0},
  lastActivityDate      : {type: Date},
  imageURL              : {type: String},
  neo4jCredentials      : {
    connection: {type: String, required: true},
    auth: {type: String, required: true}
  },
  twitterCredentials: [ TwitterCredential.schema ],
  integrations: [ Integration.schema ]
});

/**
 * Methods
 */
teamSchema.methods.findReport = function(reportId) {
  return this.reportSets.reduce((acc, cur) => {
    return acc ? acc : cur.reports.find(cur => cur.id === reportId);
  });
}

/**
 * Schema
 */
teamSchema.virtual('id').get(function() {
  return this._id.toString();
});

teamSchema.virtual('downloadCount').get(function() {
  return this.reportSets.reduce((acc, cur) => {
    const setCount = acc.reduce((acc, cur) => {
      return acc +  cur.downloadCount;
    }, 0);
    return acc + setCount;
  }, 0)
});


teamSchema.virtual('clientProps').get(function() {
  const { name, createdDate, userCount, lastActivityDate, imageURL, downloadCount, id } = this;
  const reportSets = this.reportSets.map(cur => cur.clientProps);
  return { name, createdDate, userCount, lastActivityDate, imageURL, downloadCount, reportSets, id };
});

module.exports = mongoose.model('Team', teamSchema);
