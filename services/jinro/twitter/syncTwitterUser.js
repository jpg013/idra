const secureTwitterCredential  = require('./secureTwitterCredential');
const updateIntegration        = require('../updateIntegration');
const getTwitterFriends        = require('./getTwitterFriends');
const getTwitterFollowers      = require('./getTwitterFollowers');
const setTwitterFriends        = require('./setTwitterFriends');
const setTwitterFollowers      = require('./setTwitterFollowers');
const setUserHasBeenSynced     = require('./setUserHasBeenSynced');
const async                    = require('async');
const hasIntegrationBeenHalted = require('../hasIntegrationBeenHalted');

const syncTwitterUser = (user, integrationModel, cb) => {
  const userId = user.id;
  const twitterID = user.mediaId
  console.log('syncing user ' + user.name);
  
  // Grab available credentials before starting
  secureTwitterCredential(integrationModel, function(err, twitterCredential) {
    if (err) {
      return cb(err);
    }
    const setUserInProgress = cb => {
      const update = {
        userInProgress: user
      }
      updateIntegration(integrationModel.id, update, cb)
    }

    const getFriends = (updatedModel, cb) => {
      getTwitterFriends({twitterID, twitterCredential}, (err, friends=[]) => {
        cb(undefined, friends);    
      });
    }

    const setFriends = (friends=[], cb) => {
      setTwitterFriends(integrationModel.id, userId, friends, cb);
    }

    const getFollowers = cb => {
      getTwitterFollowers({twitterID, twitterCredential}, (err, followers=[]) => {
        cb(undefined, followers);
      })
    }

    const setFollowers = (followers=[], cb) => {
      setTwitterFollowers(integrationModel.id, userId, followers, cb);
    }
    
    const incrementCompletedCount = cb => {
      const update = { 'incCompletedCount': 1 };
      updateIntegration(integrationModel.id, update, cb)  
    }

    const setUserSynced = (updatedIntegration, cb) => {
      setUserHasBeenSynced(integrationModel.id, userId, cb);
    }

    const pipeline = [
      setUserInProgress,
      getFriends,
      setFriends,
      getFollowers,
      setFollowers,
      incrementCompletedCount,
      setUserSynced
    ];

    async.waterfall(pipeline, err => {
      if (err) {
        return cb(err);
      }
      console.log('successfully synced ' + user.name);
      hasIntegrationBeenHalted(integrationModel.id, cb);
    });
  });
}

module.exports = syncTwitterUser;