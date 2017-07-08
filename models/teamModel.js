const mongoose           = require('mongoose');
const Schema             = mongoose.Schema;
const Report             = require('./reportModel');
const TwitterCredential  = require('./twitterCredentialModel');
const Integration        = require('./integrationModel');

const teamSchema = new Schema({
  name                  : {type: String, required: true},
  reports               : [ Report.schema ],
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
  return this.reports.find(cur => cur.id === reportId);
};

/**
 * Schema
 */
teamSchema.virtual('id').get(function() {
  return this._id.toString();
});

teamSchema.virtual('downloadCount').get(function() {
  return this.reports.reduce((acc, cur) => {
    return acc + cur.downloadCount;
  }, 0);
});

teamSchema.virtual('clientProps').get(function() {
  const { name, createdDate, userCount, lastActivityDate, imageURL, downloadCount, reports, id } = this;
  return {
    name,
    createdDate,
    userCount,
    lastActivityDate,
    imageURL,
    downloadCount,
    reports,
    id
  };
});

module.exports = mongoose.model('Team', teamSchema);
