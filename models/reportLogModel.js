// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportLogSchema = new Schema({
  date: Date,
  userId: mongoose.Schema.Types.ObjectId,
});

ReportLogSchema.virtual('id').get(function() {
  return this._id.toString();
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('ReportLog', ReportLogSchema);
