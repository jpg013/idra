const mongoose         = require('mongoose');
const Schema           = mongoose.Schema;
const Report           = require('./report.model');
const immutable        = require('immutable');

const teamSchema = new Schema({
  name              : String,
  reports           : [Report.schema],
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

teamSchema.virtual('reportCollections').get(function() {
  const collectionNames = this.reports.map(cur => cur.get('collectionName'));
  return immutable.List(collectionNames).toSet().toArray(); // Get unique values
});

teamSchema.virtual('reportCollectionCount').get(function() {
  return this.reportCollections.length;
});

teamSchema.virtual('reportCount').get(function() {
  this.reports.length;
});

teamSchema.virtual('id').get(function() {
  return this._id.toString();
});

teamSchema.virtual('clientProps').get(function() {
  const { name, reportCollections, createdDate, userCount, neo4jConnection, neo4jAuth, reportCollectionCount, reportCount, id, downloadCount } = this;
  return { name, reportCollections, createdDate, userCount, neo4jConnection, neo4jAuth, reportCollectionCount, reportCount, id, downloadCount};
})

module.exports = mongoose.model('Team', teamSchema);
