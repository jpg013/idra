// get an instance of mongoose and mongoose.Schema
const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;
const reportModel = require('./report.model')

const ReportCollectionSchema = new Schema({
  name: String,
  createdDate: String,
  reports: [reportModel.schema]
});

ReportCollectionSchema.virtual('id').get(function() {
  return this._id.toString();
});

module.exports = mongoose.model('ReportCollection', ReportCollectionSchema);
