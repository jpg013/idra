const TwitterIntegrationFactory = require('../factories/twitter-integration.factory');
const TwitterIntegrationModel   = require('../models/twitter-integration.model');
const Idra                      = require('./idra.js');

const defaultFields = {
  createdTimestamp: 1,
  finishedTimestamp: 1,
  completedCount: 1,
  totalCount: 1,
  status: 1,
  _teamId: 1,
  statusMsg: 1,
  userInProgress: 1,
  createdBy: 1,
  _id: 1
};

function getTwitterIntegration(id, cb) {
  const $query = {_id: id};
  TwitterIntegrationModel
    .findOne($query, defaultFields)
    .exec(cb);
}

function getMostRecentIntegration(teamId, cb) {
  if (!teamId) return cb('missing required team id');
  const $query = {_teamId: teamId};
  const $sort = {createdTimestamp: -1}

  TwitterIntegrationModel
    .find($query, defaultFields)
    .sort($sort)
    .limit(1)
    .exec(function(err, results=[]) {
      const twitterIntegration = results[0];
      if (err) return cb(err);
      return twitterIntegration ? cb(err, twitterIntegration) : cb(err);
    });
}

function createIntegration(params={}, cb) {
  const {teamModel, userList, createdBy} = params;
  if (!teamModel) return cb('There was an error starting the Twitter Integration.');

  const modelProps = {
    teamId: teamModel.id,
    neo4jCredentials: teamModel.neo4jCredentials,
    userList,
    createdBy
  };

  const scrubbedFields = TwitterIntegrationFactory.scrubTwitterIntegrationData(modelProps);
  if (!TwitterIntegrationFactory.validateTwitterIntegrationFields(scrubbedFields)) {
    return cb('There was an error starting the Twitter Integration.');
  }
  const twitterIntegrationModel = TwitterIntegrationFactory.buildTwitterIntegrationModel(scrubbedFields);
  twitterIntegrationModel.save(err => {
    if (err) return cb(err);
    getTwitterIntegration(twitterIntegrationModel.id, cb);
  });
}

function getRunningTwitterIntegration(teamId, cb) {
  const $query = {_teamId: teamId,  status: {'$in': ['pending', 'inProgress', 'cancelling']}};

  TwitterIntegrationModel
    .findOne($query, defaultFields)
    .exec((err, results) => cb(err, results));    
}

function getPendingTwitterIntegrations(cb) {
  const $query = { status: 'pending' };
  const $sort = { createdTimestamp: 1 };

  TwitterIntegrationModel
    .find($query)
    .sort($sort)
    .exec(function(err, results=[]) {
      return cb(err, results);
    });
}

function updateTwitterIntegration(id, updateFields={}, cb) {
  const $set = buildModelSetter(updateFields);
  const $opts = {upsert: true, new: true, fields : defaultFields};
  const $query = {_id: id};
  TwitterIntegrationModel.findOneAndUpdate($query, $set, $opts, cb);
}

const buildModelSetter = (fields={}) => {
  return Object.keys(fields).reduce((acc, cur) => {
    switch(cur) {
      case 'user':
      case 'statusMsg': 
      case 'finishedTimestamp':
      case 'status':
      case 'userInProgress':
        acc.$set[cur] = fields[cur];
        break;
      default:
        break;
    }  
    return acc;
  }, {$set: {}});
}

/* Check the job status to make sure it's valid */
function checkIntegrationStatus(id, cb) {
  const $query = {_id: id};
  const $proj = { status: 1 };
  TwitterIntegrationModel
    .findOne($query, $proj)
    .lean()
    .exec(function(err, results={}) {
      return cb(err, results.status);
    });
}

function setUserFriendList(opts, cb) {
  const {id, userId, friends} = opts;
  const $query = { _id: id, 'userList.id': userId };
  const $update = { $set: { 'userList.$.friends': friends}};
  TwitterIntegrationModel.update($query, $update, err => cb(err));
}

function setUserFollowerList(opts, cb) {
  const {id, userId, followers} = opts;
  const $query = { _id: id, 'userList.id': userId };
  const $update = { $set: { 'userList.$.followers': followers}};
  TwitterIntegrationModel.update($query, $update, err => cb(err)); 
}

function incrementCompletedCount(id, cb) {
  const $query = {_id : id};
  const $update = {$inc: { completedCount: 1 }};
  TwitterIntegrationModel.update($query, $update, err => cb(err));
}

module.exports = {
  getTwitterIntegration,
  getMostRecentIntegration,
  createIntegration,
  getRunningTwitterIntegration,
  getPendingTwitterIntegrations,
  updateTwitterIntegration,
  checkIntegrationStatus,
  setUserFollowerList,
  setUserFriendList,
  incrementCompletedCount,
}