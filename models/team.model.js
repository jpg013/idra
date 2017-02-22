const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Team', new Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String
}));
