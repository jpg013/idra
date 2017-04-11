// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportGroupSchema = new Schema({
  name: String,
  createdDate: Date,
  createdBy: String,
  teamId: mongoose.Schema.Types.ObjectId
});

ReportGroupSchema.virtual('id').get(function() {
  return this._id.toString();
});

ReportGroupSchema.virtual('clientProps').get(function() {
  const {name, createdDate, createdBy, id} = this;
  return {name, createdDate, createdBy, id};
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('ReportGroup', ReportGroupSchema);


