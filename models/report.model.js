const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ReportSchema = new Schema({
  name: {type: String, required: true},
  createdDate: {type: Date, required: true, default: Date.now},
  createdBy: {
    userId: {type: mongoose.Schema.Types.ObjectId},
    userName: {type: String}
  },
  description: {type: String, required: true},
  query: {type: String, required: true},
  downloadCount: {type: Number, default: 0},
  reportSetId: {type: mongoose.Schema.Types.ObjectId, required: true},
  teamId: {type: mongoose.Schema.Types.ObjectId, required: true}
});

ReportSchema.virtual('id').get(function() {
  return this._id.toString();
});

ReportSchema.virtual('clientProps').get(function() {
  const {name, createdDate, description, query, id, createdBy, downloadCount, reportSetId, teamId} = this;
  return {name, createdDate, description, query, id, createdBy, downloadCount, reportSetId, teamId};
});

module.exports = mongoose.model('Report', ReportSchema);


