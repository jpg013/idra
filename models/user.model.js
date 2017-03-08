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
    enum: ['sys-admin', 'team-admin', 'user'],
    default: 'user'
  },
  team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'}
});

userSchema.virtual('id').get(function() {
  return this._id.toString();
});

userSchema.virtual('isSysAdmin').get(function() {
  return this.role === "sys-admin";
});

userSchema.virtual('clientProps').get(function() {
  const {email, firstName, lastName, createdDate, role, id, team} = this;
  return {email, firstName, lastName, createdDate, role, id, team};
})


module.exports = mongoose.model('User', userSchema)