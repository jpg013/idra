// get an instance of mongoose and mongoose.Schema
const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;
const ReportModel = require('./report.model');

const ReportCollectionSchema = new Schema({
  name: {type: String, required: true},
  createdDate: {type: Date, required: true, default: Date.now},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  reportList: [ReportModel.schema]
});

ReportCollectionSchema.virtual('id').get(function() {
  return this._id.toString();
});

ReportCollectionSchema.virtual('clientProps').get(function() {
  const { name, createdDate, createdBy, id } = this;
  const reportList = this.reportList.map(cur => cur.clientProps);
  return { name, createdDate, createdBy, reportList, id };
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('ReportCollection', ReportCollectionSchema);


