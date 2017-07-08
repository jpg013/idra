const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const ReportLog = require('./reportLogModel');

const ReportSchema = new Schema({
  name: {type: String, required: true},
  createdDate: {type: Date, required: true, default: Date.now},
  createdBy: {
    userId: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String}
  },
  description: {type: String, required: true},
  query: {type: String, required: true},
  downloadCount: {type: Number, default: 0},
  logs: [ReportLog.schema]
});

ReportSchema.virtual('id').get(function() {
  return this._id.toString();
});

ReportSchema.virtual('clientProps').get(function() {
  const {name, createdDate, description, query, id, createdBy, downloadCount} = this;
  return {name, createdDate, description, query, id, createdBy, downloadCount};
});

module.exports = mongoose.model('Report', ReportSchema);
