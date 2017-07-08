const IntegrationFactory = require('../factories/integration.factory');
const IntegrationModel   = require('../models/integration.model');

const defaultFields = {
  createdTimestamp: 1,
  finishedTimestamp: 1,
  completedCount: 1,
  totalCount: 1,
  status: 1,
  teamId: 1,
  type: 1,
  statusMsg: 1,
  userInProgress: 1,
  createdBy: 1,
  _id: 1
};

function getIntegration(id, cb) {
  const $query = {_id: id};
  IntegrationModel
    .findOne($query, defaultFields)
    .exec(cb);
}

function createIntegration(params={}, cb) {
  const {teamModel, userList, createdBy, type} = params;
  if (!teamModel) return cb('There was an error creating the Integration.');

  const modelProps = {
    teamId: teamModel.id,
    neo4jCredentials: teamModel.neo4jCredentials,
    userList,
    createdBy,
    type
  };

  const scrubbedFields = IntegrationFactory.scrubIntegrationData(modelProps);
  if (!IntegrationFactory.validateIntegrationFields(scrubbedFields)) {
    return cb('There was an error creating the integration.');
  }
  const integrationModel = IntegrationFactory.buildIntegrationModel(scrubbedFields);
  integrationModel.save(err => {
    if (err) return cb(err);
    getIntegration(integrationModel.id, cb);
  });
}

function getPendingIntegrations(cb) {
  const $query = { status: 'pending' };
  const $sort = { createdTimestamp: 1 };

  IntegrationModel
    .find($query)
    .sort($sort)
    .exec(function(err, results=[]) {
      return cb(err, results);
    });
}

function updateIntegration(id, updateFields={}, cb) {
  const $set = buildModelSetter(updateFields);
  const $opts = {upsert: true, new: true, fields : defaultFields};
  const $query = {_id: id};
  IntegrationModel.findOneAndUpdate($query, $set, $opts, cb);
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
  IntegrationModel
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
  IntegrationModel.update($query, $update, err => cb(err));
}

function setUserFollowerList(opts, cb) {
  const {id, userId, followers} = opts;
  const $query = { _id: id, 'userList.id': userId };
  const $update = { $set: { 'userList.$.followers': followers}};
  IntegrationModel.update($query, $update, err => cb(err)); 
}

function incrementCompletedCount(id, cb) {
  const $query = {_id : id};
  const $update = { $inc: { completedCount: 1 }};
  IntegrationModel.update($query, $update, err => cb(err));
}

module.exports = {
  getIntegration,
  createIntegration,
  getPendingIntegrations,
  updateIntegration,
  checkIntegrationStatus,
  setUserFollowerList,
  setUserFriendList,
  incrementCompletedCount,
}