const secureTwitterCredential  = require('./secureTwitterCredential');
const updateIntegration        = require('../updateIntegration');
const getTwitterFriends        = require('./getTwitterFriends');
const getTwitterFollowers      = require('./getTwitterFollowers');
const getTwitterUserProfile    = require('./getTwitterUserProfile');
const setTwitterFriends        = require('./setTwitterFriends');
const setTwitterFollowers      = require('./setTwitterFollowers');
const setTwitterUserProfile    = require('./setTwitterUserProfile');
const setUserHasBeenSynced     = require('./setUserHasBeenSynced');
const async                    = require('async');
const hasIntegrationBeenHalted = require('../hasIntegrationBeenHalted');

const syncTwitterUser = (user, integrationModel, cb) => {
  const userId = user.id;
  const twitterScreenName = user.screenName;
  
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
      getTwitterFriends({twitterScreenName, twitterCredential}, (err, friends=[]) => {
        cb(undefined, friends);    
      });
    }

    const setFriends = (friends=[], cb) => {
      setTwitterFriends(integrationModel.id, userId, friends, cb);
    }

    const getFollowers = cb => {
      getTwitterFollowers({twitterScreenName, twitterCredential}, (err, followers=[]) => {
        cb(undefined, followers);
      })
    }

    const setFollowers = (followers=[], cb) => {
      setTwitterFollowers(integrationModel.id, userId, followers, cb);
    }

    const getUserProfile = cb => {
      getTwitterUserProfile({twitterScreenName, twitterCredential}, (err, profile={}) => {
        cb(undefined, profile);
      })
    }

    const setUserProfile = (profile, cb) => {
      setTwitterUserProfile(integrationModel.id, userId, profile, cb);
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
      getUserProfile,
      setUserProfile,
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