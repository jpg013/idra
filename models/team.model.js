const mongoose       = require('mongoose');
const Schema         = mongoose.Schema;
const reportSetModel = require('./report-set.model');

const TeamSchema = new Schema({
  name        : String,
  reportSets  : [reportSetModel.schema],
  createdDate : Date,
  userCount   : Number
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

module.exports = mongoose.model('Team', TeamSchema);
