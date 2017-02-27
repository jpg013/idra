// get an instance of mongoose and mongoose.Schema
const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;
const reportModel = require('./report.model')

const ReportSetSchema = new Schema({
  name: String,
  createdDate: String,
  reports: [reportModel.schema]
});

module.exports = mongoose.model('ReportSet', ReportSetSchema);
