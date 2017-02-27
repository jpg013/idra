const mongoose       = require('mongoose');
const Schema         = mongoose.Schema;
const reportSetModel = require('./report-set.model');

const TeamSchema = new Schema({
  name        : String,
  reportSets  : [reportSetModel.schema],
  createdDate : Date
});

module.exports = mongoose.model('Team', TeamSchema);
