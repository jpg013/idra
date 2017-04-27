const User         = require('../models/user.model');
const TeamService  = require('./team.service');
const cryptoClient = require('../common/crypto');
const mongoClient  = require('../common/mongo');
const async        = require('async');
const UserFactory  = require('../factories/user.factory');

/**
 * Error messages
 */
const invalidUserDataMsg = 'Invalid user data';
const createUserErrorMsg = 'There was an error creating the user';
const userExistsMsg = 'A user with this email already exists';
const teamDoesNotExistErrorMsg = 'Team does not exist';

const queryUsers = (query, cb) => {
  User.find(query)
    .populate('team')
    .exec(cb);
}

const findUser = (id, cb) => User.findOne({_id: id}).populate('team').exec(cb);  

const findUserByUsername = (email, cb) => User.findOne({email}).populate('team').exec(cb);

const checkIfUserIsUnique = (userModel, cb) => {
  findUserByUsername(userModel.email, function(err, duplicateUser) {
    if (err) return cb(err);
    return duplicateUser ? cb(userExistsMsg) : cb(undefined, userModel);
  });
}

const doesUserTeamExist = (userModel, cb) => {
  TeamService.findTeam(userModel.team, function(err, teamModel) {
    if (err) return cb(err);
    return teamModel ? cb(undefined, userModel) : cb(teamDoesNotExistErrorMsg);
  });
}

const persistNewUser = (dirtyUserModel, cb) => {
  dirtyUserModel.save(function(err) {
    if (err) return cb(err);
    findUser(dirtyUserModel.id, function(err, newUserModel) {
      return cb(err, newUserModel);
    });
  })
}
  
const createUser = (data, cb) => {
  const scrubbedUserData = UserFactory.scrubUserData(data);
  if (!UserFactory.validateUserFields(scrubbedUserData)) {
    return cb(invalidUserDataMsg);
  }

  const buildUser = callback => callback(undefined, UserFactory.buildUserModel(scrubbedUserData));
  
  const incrementTeamUserCount = (userModel, cb) => {
    if (!userModel) return cb(createUserErrorMsg);
    TeamService.incrementUserCount(userModel.team.id, function(err) {
      return cb(err, userModel);
    });
  }

  const onUserSaved = (userModel, cb) => {
    if (!userModel) {
      return cb(createUserErrorMsg);
    }
    findUser(userModel.id, cb);
  };

  const waterfallPipeline = [
    buildUser, 
    checkIfUserIsUnique, 
    doesUserTeamExist, 
    persistNewUser, 
    incrementTeamUserCount, 
    onUserSaved
    ];  
  async.waterfall(waterfallPipeline, cb);
}

const deleteUser = (id, cb) => {
  User.findByIdAndRemove(id, cb);
}

const editUser = (userData, cb) => {
  
}

function buildUserUpdateObject(update) {
  const val = {
    $set: {}
  };

  return Object.keys(update)
    .reduce((acc, cur) => {
      if (cur === 'password') {
        acc.$set.password = update[cur];
      } else if (cur === 'passwordChangeRequired') {
        acc.$set.passwordChangeRequired = update[cur];
      } else if (cur === 'lastLoginDate') {
        acc.$set.lastLoginDate = update[cur];
      }
      return acc;
    }, val);
}

function updateUserModel(userId, updateObject, cb) {
  if (!userId || !updateObject) {
    return cb('missing user id or update');
  }
  
  findUser(userId, function(err, userModel) {
    if (err) return cb(err);
    if (!userModel) return cb('could not find user');
    const $update = buildUserUpdateObject(updateObject);
    const opts = {
      upsert: true,
      new: true
    };

    const pipeline = [
      callback => User.update({_id: userId}, $update, opts, callback),
      (update, callback) => {
        findUser(userId, callback) 
      }
    ];
    async.waterfall(pipeline, cb);
  });
}

module.exports = {
  queryUsers,
  createUser,
  deleteUser,
  editUser,
  findUserByUsername,
  findUser,
  updateUserModel
};