const mongoose         = require('mongoose');
const Schema           = mongoose.Schema;
const ReportGroup      = require('./report-group.model');
const immutable        = require('immutable');

const teamSchema = new Schema({
  name              : String,
  reportCollection  : [ReportGroup.schema],
  createdDate       : Date,
  userCount         : Number,
  neo4jConnection   : String,
  neo4jAuth         : String,
  lastActivityDate  : Date,
  imageURL          : String
});

/**
 * Methods
 */
teamSchema.methods.findReport = function(reportId) {
  
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
  console.log(reportCollection);
  return { name, reportCollection, createdDate, userCount, id, downloadCount, imageURL, lastActivityDate };
})

module.exports = mongoose.model('Team', teamSchema);
