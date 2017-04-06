// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  name: String,
  createdDate: Date,
  description: String,
  query: String,
  collectionName: String
});

ReportSchema.virtual('id').get(function() {
  return this._id.toString();
});

ReportSchema.virtual('clientProps').get(function() {
  const {name, createdDate, description, query, collectionName, id} = this;
  return {name, createdDate, description, query, collectionName, id};
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Report', ReportSchema);


