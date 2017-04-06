const User            = require('../models/user.model');
const teamsService    = require('./teams.service');
const cryptoClient    = require('../common/crypto');
const mongoClient     = require('../common/mongo');
const async           = require('async');

/**
 * Error messages
 */
const invalidTeamFormMsg = 'Invalid user form data';
const createUserErrorMsg = 'There was an error creating the user';
const userExistsMsg = 'A user with this email already exists';
const teamDoesNotExistErrorMsg = 'Team does not exist';
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isValidEmail = email => emailRegex.test(email);

const queryUsers = (query, cb) => {
  User.find(query)
    .populate('team')
    .exec(cb);
}

const findUser = (id, cb) => User.findOne({_id: id}).populate('team').exec(cb);  

const findUserByUsername = (email, cb) => User.findOne({email}).populate('team').exec(cb);

const sanitizeUserData = userData => {
  const { email, firstName, lastName, password } = userData;
  if (!firstName || !lastName || !isValidEmail(email) || !password || !isValidUserPassword(password)) {
    return false;
  }
  
  let team = userData.team;
  if (!team) {
    return;
  }
  team = mongoClient.generateObjectId(team);
  
  let role = (userData.role === 'admin') ? 'admin' : 'user';
  return { email, firstName, lastName, team, role, password };
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
  teamsService.findTeam(userModel.team, function(err, teamModel) {
    if (err) return cb(err);
    return teamModel ? cb(undefined, userModel) : cb(teamDoesNotExistErrorMsg);
  });
}

const persistNewUser = (userModel, cb) => userModel.save(err => cb(err, userModel));
  
const buildUserModel = userData => {
  const { email, firstName, lastName, team, role, password } = userData;
  const modelProps = Object.assign({}, {
    password: cryptoClient.encrypt(password),
    createdDate: new Date(),
    email,
    firstName,
    lastName,
    team,
    role,
  });
  return new User(modelProps);
}
  
const createUser = (userData, cb) => {
  const sanitizedUserData = sanitizeUserData(userData);
  if (!sanitizedUserData) {
    return cb(invalidTeamFormMsg);
  };
  const buildUser = (callback) => {
    const newUserModel = buildUserModel(sanitizedUserData);
    callback(undefined, newUserModel); 
  };
  const onUserSaved = (userModel, cb) => {
    if (!userModel) {
      return cb(createUserErrorMsg);
    }
    findUser(userModel.id, cb);
  };

  const waterfallPipeline = [buildUser, checkIfUserIsUnique, doesUserTeamExist, persistNewUser, onUserSaved];  
  async.waterfall(waterfallPipeline, cb);
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
  createUser,
  deleteUser,
  isValidUserPassword,
  editUser,
  findUserByUsername,
  findUser
};