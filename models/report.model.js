const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ReportSchema = new Schema({
  name: {type: String, required: true},
  createdDate: {type: Date, required: true, default: Date.now},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  description: {type: String, required: true},
  query: {type: String, required: true},
  downloadCount: {type: Number, default: 0},
  reportCollectionId: {type: mongoose.Schema.Types.ObjectId, required: true},
});

ReportSchema.virtual('id').get(function() {
  return this._id.toString();
});

ReportSchema.virtual('clientProps').get(function() {
  const {name, createdDate, description, query, id, createdBy, downloadCount, reportCollectionId} = this;
  return {name, createdDate, description, query, id, createdBy, downloadCount, reportCollectionId};
});

module.exports = mongoose.model('Report', ReportSchema);


