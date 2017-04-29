// get an instance of mongoose and mongoose.Schema
const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;

const reportSetSchema = new Schema({
  name: {type: String, required: true},
  createdDate: {type: Date, required: true, default: Date.now},
  createdBy: {
    userId: {type: mongoose.Schema.Types.ObjectId},
    userName: {type: String}
  },
  teamId: {type: mongoose.Schema.Types.ObjectId, required: true}
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
  const { name, createdDate, id, teamId } = this;
  const createdBy = this.createdBy.userName;
  return { name, createdDate, createdBy, id, teamId };
});

module.exports = mongoose.model('ReportSet', reportSetSchema);


