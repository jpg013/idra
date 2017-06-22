// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Report   = require('./report.model');

const reportSetSchema = new Schema({
  name: {type: String, required: true},
  createdDate: {type: Date, required: true, default: Date.now},
  createdBy: {
    id: {type: mongoose.Schema.Types.ObjectId},
    userName: {type: String}
  },
  teamId: {type: mongoose.Schema.Types.ObjectId, required: true},
  reports : [Report.schema],
});

/**
 * Methods
 */

/**
 * Virtuals
 */

reportSetSchema.virtual('id').get(function() {
  return this._id.toString();
});

reportSetSchema.virtual('clientProps').get(function() {
  const { name, createdDate, id, createdby, teamId} = this;
  const reports = this.reports.map(cur => cur.clientProps);
  return { name, createdDate, createdBy, id, teamId, reports };
});

module.exports = mongoose.model('ReportSet', reportSetSchema);


