const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
  email: String,
  firstName: String,
  lastName: String,
  password: String,
  createdDate: Date,
  lastLoginDate: Date,
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
  const {lastLoginDate, email, firstName, lastName, createdDate, role, id} = this;
  const team = this.team.clientProps;
  return {lastLoginDate, email, firstName, lastName, createdDate, role, id, team};
})


module.exports = mongoose.model('User', userSchema)