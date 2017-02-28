// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  name: String,
  createdDate: Date,
  description: String,
  query: String
});

ReportSchema.virtual('id').get(function() {
  return this._id.toString();
})

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Report', ReportSchema);


