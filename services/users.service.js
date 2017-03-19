const User            = require('../models/user.model');
const teamsService    = require('./teams.service');
const cryptoClient    = require('../common/crypto');
const async           = require('async');

const userExistsMsg = 'A user with this email already exists';
const teamDoesNotExistErrorMsg = 'Team does not exists';
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isValidEmail = email => emailRegex.test(email);

const queryUsers = (query, cb) => {
  User.find(query)
    .populate('team')
    .exec(cb)
}

const findUser = (id, cb) => User.findOne({_id: id}).populate('team').exec(cb);  

const findUserByUsername = (email, cb) => User.findOne({email}, cb);

const validateUserForm = formData => {
  const { firstName, lastName, email, password } = formData;
  if (!firstName || !lastName || !isValidEmail(email) || !password || !isValidUserPassword(password)) {
    return false;
  }
  return true;
}

const isValidUserPassword = password => {
  return password.trim().length >= 8;
}

const checkIfUserIsUnique = (userModel, cb) => {
  findUserByUsername(userModel.email, function(err, duplicateUser) {
    if (err) return cb(err);
    return duplicateUser ? cb(userExistsMsg) : cb(undefined, userModel);
  });
}

const doesUserTeamExist = (userModel, cb) => {
  teamsService.findTeam(userModel.teamId, function(err, teamModel) {
    if (err) return cb(err);
    return teamModel ? cb(undefined, userModel) : cb(teamDoesNotExistErrorMsg);
  });
}

const persistNewUser = (userModel, cb) => userModel.save(err => cb(err, userModel.id));
  
const findNewUser = (userId, cb) => findUser(userId, cb);
  
const createUser = (userData, cb) => {
  const createUserModel = cb => {
    const { email, firstName, lastName, teamId, role, password } = userData;
    const userModel = new User({
      email,
      firstName,
      lastName,
      teamId,
      role,
      password: cryptoClient.encrypt(password),
      createdDate: new Date(),
    });
    return cb(userModel);
  }  
  
  const pipeline = [createuserModel, checkIfUserIsUnique, doesTeamExist, persistNewUser, findNewUser];
  async.waterfall(pipeline, onDone);
}

const deleteUser = (id, cb) => {
  User.findByIdAndRemove(id, cb);
}

const editUser = (userData, cb) => {
  if (userData.password && !isValidUserPassword(userData.password)) {
    return cb('invalid password');
  }
}

module.exports = {
  queryUsers,
  validateUserForm,
  createUser,
  deleteUser,
  isValidUserPassword,
  editUser
};