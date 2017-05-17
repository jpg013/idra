'use strict';

/**
 * Module dependencies.
 */
const TwitterService            = require('./twitter.service');
const TwitterIntegrationService = require('../twitter-integration.service');
const TwitterCredential         = require('../../models/twitter-credential.model');
const async                     = require('async');
const CronJob                   = require('cron').CronJob;
const Idra                      = require('../idra');
const SocketIO                  = require('../../socket/io');

/*
 * Error Messages
 */

const invalidTwitterCredentials = 'Twitter access token is invalid.';
const integrationError = 'An error occurred during Twitter integration.'

function twitterIntegrationSuccessHandler(id, cb) {
  console.log('twitter integration success handler')
  /*
  const $opts = {upsert: true, new: true };
  const $query = {_id: jobId};
  const $set = {
    $set: {
      'status': 'completed',
      'statusMsg': 'Twitter Integration Successfully Completed',
      'finishedTimestamp': new Date().getTime()  
    }
  };
  TwitterIntegration.findOneAndUpdate($query, $set, $opts, (err, twitterIntegrationModel) => {
    if (err) return cb(err);
    SocketIO.handleTwitterIntegrationUpdate(twitterIntegrationModel);
  });
  */
}

function twitterIntegrationErrorHandler(id, err, cb) {
  let update = { finishedTimestamp: new Date().getTime() };
  if (err === 'integration stopped') {
    update.status = 'cancelled';
    update.statusMsg = 'Integration cancelled';
  } else {
    update.status = 'error';
    update.statusMsg = err;
  }
  TwitterIntegrationService.updateTwitterIntegration(id, update, () => {
    sendUpdateToClient(id);
  });
}

function executePendingTwitterIntegrations(onFinished) {
  TwitterIntegrationService.getPendingTwitterIntegrations(function(err, results=[]) {
    if (err) return cb(err);
    async.eachSeries(results, function(integration, cb) {
      runTwitterIntegration(integration, err => {
        return err ? twitterIntegrationErrorHandler(integration.id, err, cb) : twitterIntegrationSuccessHandler(integration.id, cb);
      });
    }, onFinished);
  });
}

function upsertTwitterFollowers(opts, cb) {
  const {neo4jCredentials, twitterID, followers} = opts;
  if (!neo4jCredentials || !twitterID || !followers) return cb('missing required data');
  const params = { neo4jCredentials, twitterID, followers};
  Idra.upsertManyAndFollowers(params, err => cb(err));
}

function upsertTwitterFriends(opts, cb) {
  const {neo4jCredentials, twitterID, friends} = opts;
  if (!neo4jCredentials || !twitterID || !friends) return cb('missing required data');
  const params = { neo4jCredentials, twitterID, friends};
  Idra.upsertManyAndFriends(params, err => cb(err));
}

function isRateLimitExceeded(rateLimit) {
  return (rateLimit.friends.remaining < 2 && rateLimit.followers.remaining < 2 || rateLimit.application.remaining < 2);
}

function queryTwitterCredential(integration, cb) {
  if (!integration) return cb('missing required job');
  const $query = { 'teamId' : integration.teamId };
  TwitterCredential.findOne($query, cb);
}

function secureTwitterCredential(integration, cb) {
  const pipeline = [
    cb => queryTwitterCredential(integration, cb),
    (cred, cb) => {
      if (!cred) return cb('Could not find twitter credentials');
      if (cred.lockedUntil) return cb('locked');
      TwitterService.getRateLimitStatus(cred, (err, rateLimit) => cb(err, cred, rateLimit));
    },
    (cred, rateLimit, cb) => {
      if (!isRateLimitExceeded(rateLimit)) {
        return cb(undefined, cred);
      } else {
        lockTwitterCredential(cred, getResetTimeForTwitterCredential(rateLimit), cb);
      }
    }
  ];

  async.waterfall(pipeline, function(err, cred) {
    if (err && err !== 'locked') return cb(err);
    
    if (err === 'locked' || !cred || cred.lockedUntil) {
      waitForTwitterCredentialToUnlock(integration, (err) => err ? cb(err) : secureTwitterCredential(integration, cb));
    } else {
      return cb(err, cred);  
    }
  })
}

function waitForTwitterCredentialToUnlock(integration, cb) {
  if (!integration) return cb('missing required integration');
  queryTwitterCredential(integration, function(err, cred) {
    if (err) return cb(err);
    if (!cred) return cb('Could not find twitter credentials');
    if (!cred.lockedUntil || isNaN(cred.lockedUntil)) return cb();
    
    const wait = cred.lockedUntil - new Date().getTime() + 1000;

    // Await unlocking
    setTimeout(() => { cb() }, wait);  
  })
}

function getResetTimeForTwitterCredential(rateLimit) {
  return Math.max(
    TwitterService.getFriendsRateLimitReset(rateLimit),
    TwitterService.getFollowersRateLimitReset(rateLimit),
    TwitterService.getApplicationRateLimitReset(rateLimit)
  )
}

function scheduleTwitterCredentialUnlock(twitterCred, timeInterval) {
  if (!twitterCred || isNaN(timeInterval)) {return}
  // TODO: Maybe something a little more sophisticated than a set timeout
  setTimeout(() => { unlockTwitterCredential(twitterCred.id) }, timeInterval);
}

function unlockTwitterCredential(id) {
  const $query = {_id: id};
  const $update = { $unset: {'lockedUntil': ""}};
  TwitterCredential.update($query, $update, err => err);
}

function lockTwitterCredential(cred, reset, cb) {
  const $query = {_id: cred.id};
  const $update = { $set: {'lockedUntil':reset} } ;
  const interval = reset - new Date().getTime();
  
  TwitterCredential.findOneAndUpdate($query, $update, {new: true}, (err, cred) => {
    if (err) return cb(err);
    scheduleTwitterCredentialUnlock(cred, interval)
    return cb(err, cred);
  });
}

function hasIntegrationBeenHalted(id, cb) {
  TwitterIntegrationService.checkIntegrationStatus(id, function(err, status) {
    if (err) return cb(err);
    
    switch(status) {
      case 'cancelling':
        return cb('integration stopped')
      case 'error':
      case 'completed':
        return cb('Invalid integration status');
      default:
        return cb();
    }
  });
}

function processIntegrationUserList(twitterIntegration, cb) {
  if (!twitterIntegration) return cb('missing required data');
  const userList = twitterIntegration.userList.slice(); // Slice the user list data
  const { neo4jCredentials, id } = twitterIntegration;

  async.eachSeries(userList, function(user, cb) {
    const { twitterID } = user;
    const userId = user.id;
    
    // Grab available credentials before starting
    secureTwitterCredential(twitterIntegration, function(err, twitterCred) {
      if (err) return cb(err);
      
      const updateUserInProgress = cb => TwitterIntegrationService.updateTwitterIntegration(id, {userInProgress: user }, err => {
        sendUpdateToClient(id);
        cb(err);
      });
      const getFriends = cb => TwitterService.getTwitterFriends({twitterID, twitterCred}, (err, friends=[]) => cb(undefined, friends));
      const setFriends = (friends=[], cb) => TwitterIntegrationService.setUserFriendList({id, userId, friends}, err => cb(err, friends));
      const upsertFriends = (friends=[], cb) => upsertTwitterFriends({neo4jCredentials, friends, twitterID}, cb);
      const getFollowers = cb => TwitterService.getTwitterFollowers({twitterID, twitterCred}, (err, followers=[]) => cb(undefined, followers));
      const setFollowers = (followers=[], cb) => TwitterIntegrationService.setUserFollowerList({id, userId, followers}, err => cb(err, followers));
      const upsertFollowers = (followers=[], cb) => upsertTwitterFollowers({neo4jCredentials, followers, twitterID}, cb);
      const incCompleted = cb => TwitterIntegrationService.incrementIntegrationCompleted(id, err => {
        sendUpdateToClient(id);
        cb(err);
      });
      
      const pipeline = [
        updateUserInProgress,
        getFriends,
        setFriends,
        upsertFriends,
        getFollowers,
        setFollowers,
        upsertFollowers,
        incCompleted
      ];

      async.waterfall(pipeline, err => {
        if (err) return cb(err); 
        hasIntegrationBeenHalted(twitterIntegration.id, cb)
      });
    });
  }, cb);
}

function runTwitterIntegration(twitterIntegration, cb) {
  if (!twitterIntegration) { return }
  
  const statusUpdate = {
    status: 'inProgress',
    statusMsg: 'Running Twitter Integration'
  };
  
  TwitterIntegrationService.updateTwitterIntegration(twitterIntegration.id, statusUpdate, function(err, updatedIntegration) {
    if (err) return cb(err);
    if (!updatedIntegration) return cb('missing required integration');
    sendUpdateToClient(updatedIntegration.id);
    processIntegrationUserList(twitterIntegration, cb)
  });
}

function runPendingTwitterIntegrations() {
  // kick off cron job in 5 seconds
  startCronJob(5);
}

function onCronJobFinished(err) {}

function startCronJob(delay = 1) {
  const startTime = new Date();
  startTime.setSeconds(startTime.getSeconds() + delay);
  return new CronJob(startTime, executePendingTwitterIntegrations, onCronJobFinished, true, 'America/Los_Angeles');
}

function sendUpdateToClient(id) {
  TwitterIntegrationService.getTwitterIntegration(id, function(err, twitterIntegration={}) {
    SocketIO.handleTwitterIntegrationUpdate(twitterIntegration);
  });
}

module.exports = {
  runPendingTwitterIntegrations
}
