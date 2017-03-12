const mongoose       = require('mongoose');
const Schema         = mongoose.Schema;
const reportSetModel = require('./report-set.model');

const TeamSchema = new Schema({
  name        : String,
  reportSets  : [reportSetModel.schema],
  createdDate : Date,
  userCount   : Number,
  neo4jConnection: String,
  neo4jAuth: String
});

TeamSchema.virtual('reportSetCount').get(function() {
  return this.reportSets.length;
});

TeamSchema.virtual('reportCount').get(function() {
  return this.reportSets.reduce((acc, cur) => {
    return acc + cur.reports.length;
  }, 0);
});

TeamSchema.virtual('id').get(function() {
  return this._id.toString();
});

TeamSchema.virtual('clientProps').get(function() {
  const { name, reportsSets, createdDate, userCount, neo4jConnection, neo4jAuth, reportSetCount, reportCount, id } = this;
  return { name, reportsSets, createdDate, userCount, neo4jConnection, neo4jAuth, reportSetCount, reportCount, id};
})

module.exports = mongoose.model('Team', TeamSchema);
