const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
  id: mongoose.Schema.Types.ObjectId,
  email: String,
  firstName: String,
  lastName: String,
  password: String,
  createdDate: Date,
  role: {
    type: String,
    enum: ['sys-admin', 'team-admin', 'user'],
    default: 'user'
  },
  team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'}
}));
