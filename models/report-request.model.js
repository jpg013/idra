const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ReportRequestSchema = new Schema({
  request: {type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  reportCollectionId: {type: mongoose.Schema.Types.ObjectId, ref: 'ReportCollection', required: true},
  requestedDate: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model('ReportRequest', ReportRequestSchema);


