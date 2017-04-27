const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ReportRequestSchema = new Schema({
  request: String,
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  groupId: mongoose.Schema.Types.ObjectId,
  requestedDate: Date 
});

module.exports = mongoose.model('ReportRequest', ReportRequestSchema);


