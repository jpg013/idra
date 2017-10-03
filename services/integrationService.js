const IntegrationFactory = require('../factories/integrationFactory');
const IntegrationModel   = require('../models/integrationModel');
const json2csv           = require('json2csv');

const defaultFields = {
  createdDate: 1,
  finishedDate: 1,
  completedCount: 1,
  totalCount: 1,
  status: 1,
  teamId: 1,
  type: 1,
  statusMsg: 1,
  userInProgress: 1,
  createdByName: 1,
  createdById: 1,
  socialMediaCredential: 1,
  _id: 1
};

function getIntegration(id, cb) {
  const $query = {_id: id};
  IntegrationModel
    .findOne($query, defaultFields)
    .exec(cb);
}

function getIntegrationUserList(id, cb) {
  const $query = {_id: id};
  IntegrationModel
    .findOne($query, {userList: 1})
    .exec(cb);
}

function getActiveIntegrationsForTeam(teamId, type, cb) {
  const $query = { 
    teamId: teamId, 
    status: {
      $in : ['pending', 'inProgress']
    }, 
    type: {
      $eq: type
    } 
  };
  const $fields = { _id: 1 }

  IntegrationModel
    .findOne($query, $fields)
    .exec(cb);
}

function getIntegrationsForTeam(teamId, cb) {
  const $query = { teamId };
  IntegrationModel
    .find($query, defaultFields)
    .exec(cb);
}

function deleteIntegration(id, cb) {
  const $query = { _id: id };
  IntegrationModel.remove($query, cb);
}

function createIntegration(data={}, cb) {
  const scrubbedFields = IntegrationFactory.scrubIntegrationData(data);
  if (!IntegrationFactory.validateIntegrationFields(scrubbedFields)) {
    return cb('There was an error creating the integration.');
  }
  const integrationModel = IntegrationFactory.buildIntegrationModel(scrubbedFields);
  integrationModel.save(err => {
    if (err) {
      return cb(err);
    }
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

function getPendingAndActiveIntegrations(cb) {
  const $query = { 
    status: {
      $in: ['pending', 'inProgress', 'error'] 
    } 
  };
  const $sort = { createdTimestamp: 1 };
  IntegrationModel
    .find($query)
    .sort($sort)
    .exec(cb);
}

function updateIntegration(id, updateFields={}, cb) {
  const $set = makeModelSetter(updateFields);
  const $opts = {upsert: true, new: true, fields : defaultFields};
  const $query = {_id: id};
  IntegrationModel.findOneAndUpdate($query, $set, $opts, cb);
}

const makeModelSetter = (fields={}) => {
  return Object.keys(fields).reduce((acc, cur) => {
    switch(cur) {
      case 'user':
      case 'statusMsg':
      case 'finishedDate':
      case 'status':
      case 'userInProgress':
        acc.$set[cur] = fields[cur];
        break;
      case 'incCompletedCount':
        acc.$inc = {
          completedCount: fields[cur]
        };
        break;
      default:
        break;
    }
    return acc;
  }, {$set: {}});
}

function getIntegrationStatus(id, cb) {
  const $query = {_id: id};
  const $proj = { status: 1 };
  IntegrationModel
    .findOne($query, $proj)
    .lean()
    .exec(function(err, results={}) {
      return cb(err, results.status);
    });
}

function setUserHasBeenSynced(opts, cb) {
  const {id, userId} = opts;
  const $query = { _id: id, 'userList.id': userId };
  const $update = { $set: { 'userList.$.hasBeenSynced': true}};
  IntegrationModel.update($query, $update, err => cb(err));
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

function setUserProfile(opts, cb) {
  const {id, userId, mediaId} = opts;
  const $query = { _id: id, 'userList.id': userId };
  const $update = { $set: { 'userList.$.mediaId': mediaId}};
  IntegrationModel.update($query, $update, err => cb(err));
}

function downloadMediaIdReport(id, cb) {
  const $query = { _id: id };
  IntegrationModel.findOne($query, (err, result) => {
    if (err) {
      return cb(err);
    }
    if (!result) {
      return cb('could not find integration');
    }
    const data = result.userList
      .filter(cur => cur.hasBeenSynced)
      .map(cur => {
        const {id, mediaId, screenName } = cur
        return {
          ID: id,
          Screen_Name: screenName,
          MediaId: mediaId
        }
      });
    
    const fields = ['ID', 'Screen_Name', 'MediaId'];
    const report = json2csv({ data, fields });
    return cb(err, report)
  });
}

function downloadFriendsAndFolowersReport(id, cb) {
  const $query = { _id: id };
  IntegrationModel.findOne($query, (err, result) => {
    if (err) {
      return cb(err);
    }
    if (!result) {
      return cb('could not find integration');
    }
    const data = result.userList
      .filter(cur => cur.hasBeenSynced)
      .map(cur => {
        const { mediaId, friends, followers } = cur
        return friends.map(friend => {
          return {
            friend: friend.mediaId,
            follower: mediaId
          }
        })
        .concat(followers.map(follower => {
          return {
            friend: mediaId,
            follower: follower.mediaId
          }
        }))
      })
      .reduce((acc, cur) => {
        return acc.concat(cur);
      }, [])

      const fields = ['friend', 'follower'];
    const report = json2csv({ data, fields });
    return cb(err, report)
  });
}

module.exports = {
  getIntegration,
  getIntegrationUserList,
  createIntegration,
  deleteIntegration,
  getPendingIntegrations,
  getPendingAndActiveIntegrations,
  updateIntegration,
  getIntegrationStatus,
  setUserFollowerList,
  setUserFriendList,
  setUserProfile,
  setUserHasBeenSynced,
  getIntegrationsForTeam,
  getActiveIntegrationsForTeam,
  downloadMediaIdReport,
  downloadFriendsAndFolowersReport
}
