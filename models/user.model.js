const mongoose = require('mongoose');
const schema = mongoose.Schema;
const TeamModel = require('./team.model');

const userSchema = new schema({
  email: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  password: {type: String, required: true},
  createdDate: {type: Date, default: Date.now},
  lastLoginDate: {type: Date},
  passwordChangeRequired: {type: Boolean, default: false},
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'}
});

userSchema.virtual('id').get(function() {
  return this._id.toString();
});

userSchema.virtual('isAdmin').get(function() {
  return this.role === "admin";
});

userSchema.virtual('clientProps').get(function() {
  const {lastLoginDate, email, firstName, lastName, createdDate, role, passwordChangeRequired, id} = this;
  const team = (this.team instanceof TeamModel) ? this.team.clientProps : this.team;
  return {lastLoginDate, email, firstName, lastName, createdDate, role, passwordChangeRequired, id, team};
})


module.exports = mongoose.model('User', userSchema)