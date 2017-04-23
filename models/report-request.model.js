// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema      = mongoose.Schema;

const ReportRequestSchema = new Schema({
  report: String,
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  groupId: mongoose.Schema.Types.ObjectId,
  requestedDate: Date 
});

module.exports = mongoose.model('ReportRequest', ReportRequestSchema);


