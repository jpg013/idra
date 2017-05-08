'use strict';

/**
 * Module dependencies.
 */
const Twitter               = require('twitter');
const TwitterIntegrationJob = require('../models/twitter-integration-job.model');
const TwitterCredential     = require('../models/twitter-credential.model');
const async                 = require('async');
const CronJob               = require('cron').CronJob;
const CryptoClient          = require('../common/crypto');
const Idra                  = require('./idra');

const twitterIntegrationErrMsg = "There was an error integration user team with twitter";
const twitterIntegrationInProgressMsg = "Twitter integration currently in progress for user team";

const MAX_RATE_LIMIT_WINDOW = 900000; // 15 minutes

function executePendingTwitterIntegrationJobs(cb) {
  TwitterIntegrationJob.find({status: 'pending'}, function(err, results = []) {
    if (err) {
      return cb('error finding pending cron jobs');
    }
    async.eachSeries(results, function(job, cb) {
      runTwitterIntegration(job, cb);
    }, cb)
  });
}

function onCronJobFinished(err) {
  if (err) {
    console.log('cron process finished with error : ', err);
  } else {
    console.log('finished all cron jobs successfully');  
  }
}

function startCronJob(delay = 1) {
  const startTime = new Date();
  startTime.setSeconds(startTime.getSeconds() + delay);
  return new CronJob(startTime, executePendingTwitterIntegrationJobs, onCronJobFinished, true, 'America/Los_Angeles');
}

// Update the job status
const updateJobStatus = (opts, cb) => {
  const {jobId, status, msg} = opts;
  const $opts = {upsert: true, new: true };
  const $query = {_id: jobId};
  const $set = {$set: {'status': status, 'statusMsg': msg}};
  TwitterIntegrationJob.findOneAndUpdate($query, $set, $opts, cb);
}

const decryptTwitterCredentials = creds => {
  const { consumer_key, consumer_secret, access_token_key, access_token_secret} = creds;
  return {
    consumer_key: CryptoClient.decrypt(consumer_key),
    consumer_secret: CryptoClient.decrypt(consumer_secret),
    access_token_key: CryptoClient.decrypt(access_token_key),
    access_token_secret: CryptoClient.decrypt(access_token_secret)
  }
}

const getTwitterClient = cred => new Twitter(decryptTwitterCredentials(cred));

function getIntegrationUserList(job, cb) {
  /* Call out to idra to get the user list to integrate */
  Idra.getTwitterScreenNames(job.neo4jCredentials, function(err, results) {
    if (err || !results) {
      return cb('there was an error getting twitter integration user list');
    }
    
    const userList =  results.map(cur => Object.assign({}, cur, { followers: [], friends: [] }));
    
    const $opts = {upsert: true, new: true };
    const $query = {_id: job.id};
    const $set = {$set: {userList}};

    TwitterIntegrationJob.findOneAndUpdate($query, $set, $opts, cb)    
  });
}

function getTwitterFollowers(opts, cb) {
  const {twitterCred, twitterID} = opts;
  if (!twitterCred || !twitterID) return cb('missing required options');

  const twitterClient = getTwitterClient(twitterCred);
  
  twitterClient.get('followers/list', { screen_name: twitterID }, function(err, results = []) {
    if (err) return cb(err);
    
    const followers = results.users.map(cur => {
      const { screen_name } = cur;
      return {twitterID: screen_name};
    });
    return cb(err, followers);
  });
}

function setUserFollowerList(opts, cb) {
  const {jobId, userId, followers} = opts;
  if (!jobId || !userId || !followers) return cb('missing required options');
  
  const $query = { _id: jobId, 'userList.id': userId };
  const $update = { $set: { 'userList.$.followers': followers}};
  
  TwitterIntegrationJob.update($query, $update, err => cb(err)); 
}

function upsertTwitterFollowers(opts, cb) {
  const {neo4jCredentials, twitterID, followers} = opts;
  if (!neo4jCredentials || !twitterID || !followers) return cb('missing required data');
  const params = { neo4jCredentials, twitterID, followers};
  Idra.upsertManyAndFollowers(params, err => cb(err));
}

function getTwitterFriends(opts, cb) {
  const {twitterCred, twitterID} = opts;
  if (!twitterCred || !twitterID) return cb('missing required options');

  const twitterClient = getTwitterClient(twitterCred);
  
  twitterClient.get('friends/list', { screen_name: twitterID }, function(err, results = []) {
    if (err) return cb(err);
    
    const friends = results.users.map(cur => {
      const { screen_name } = cur;
      return {twitterID: screen_name};
    });
    return cb(err, friends);
  });
}

function setUserFriendList(opts, cb) {
  const {jobId, userId, friends} = opts;
  if (!jobId || !userId || !friends) return cb('missing required options');
  
  const $query = { _id: jobId, 'userList.id': userId };
  const $update = { $set: { 'userList.$.friends': friends}};
  
  TwitterIntegrationJob.update($query, $update, err => cb(err));
}

function upsertTwitterFriends(opts, cb) {
  const {neo4jCredentials, twitterID, friends} = opts;
  if (!neo4jCredentials || !twitterID || !friends) return cb('missing required data');
  const params = { neo4jCredentials, twitterID, friends};
  Idra.upsertManyAndFriends(params, err => cb(err));
}

function getApplicationRateLimitReset(rateLimit) {
  if (!rateLimit || typeof rateLimit.application !== 'object') return;
  
  // Reset seems to be in seconds, convert to ms
  const applicationReset = (rateLimit.application.reset * 1000);
  
  /* The reset seems to be in seconds whereas the getTime returns ms so doing a conversion on the fly */
  const adjustedReset = applicationReset + 1000; // Add 1000 ms for padding
  
  // Now plus 15 minutes
  const maxReset = new Date().getTime() + MAX_RATE_LIMIT_WINDOW; 
  if (adjustedReset < 0) { return maxReset; }
  return Math.min(maxReset, adjustedReset);
}

function getFriendsRateLimitReset(rateLimit) {
  if (!rateLimit || typeof rateLimit.friends !== 'object') return;
  
  const friendsReset = rateLimit.friends.reset * 1000;
  
  /* The reset seems to be in seconds whereas the getTime returns ms so doing a conversion on the fly */
  const adjustedReset = friendsReset + 1000; // Add 1000 ms for padding
  
  // Now plus 15 minutes
  const maxReset = new Date().getTime() + MAX_RATE_LIMIT_WINDOW; 
  if (adjustedReset < 0) { return maxReset; }
  return Math.min(maxReset, adjustedReset);
}

function getFollowersRateLimitReset(rateLimit) {
  if (!rateLimit || typeof rateLimit.followers !== 'object') { return }
  
  const followersReset = rateLimit.followers.reset * 1000;
  
  /* The reset seems to be in seconds whereas the getTime returns ms so doing a conversion on the fly */
  const adjustedReset = followersReset + 1000; // Add 1000 ms for padding
  
  // Now plus 15 minutes
  const maxReset = new Date().getTime() + MAX_RATE_LIMIT_WINDOW; 
  if (adjustedReset < 0) { return maxReset; }
  return Math.min(maxReset, adjustedReset);
}

function getRateLimitStatus(twitterCred, cb) {
  if (!twitterCred) return cb('missing required twitter creds');
  const twitterClient = getTwitterClient(twitterCred);
  
  twitterClient.get('application/rate_limit_status', function(err, results = []) {
    if (err) return cb(err);
    const friends = {
      remaining: results.resources.friends['/friends/list'].remaining,
      reset: results.resources.friends['/friends/list'].reset
    };

    const followers = {
      remaining: results.resources.followers['/followers/list'].remaining,
      reset: results.resources.followers['/followers/list'].reset
    };

    const application = {
      remaining: results.resources.application['/application/rate_limit_status'].remaining,
      reset: results.resources.application['/application/rate_limit_status'].reset
    }

    return cb(err, {friends, followers, application});
  });
}

function isRateLimitExceeded(rateLimit) {
  return (rateLimit.friends.remaining < 2 && rateLimit.followers.remaining < 2 || rateLimit.application.remaining < 2);
}

function queryTwitterCredential(job, cb) {
  if (!job) return cb('missing required job');
  const $query = { 'teamId' : job.teamId };
  TwitterCredential.findOne($query, cb);
}

function secureTwitterCredential(job, cb) {
  const pipeline = [
    cb => queryTwitterCredential(job, cb),
    (cred, cb) => {
      if (!cred) return cb('Could not find twitter credentials');
      if (cred.lockedUntil) return cb('locked');
      getRateLimitStatus(cred, (err, rateLimit) => cb(err, cred, rateLimit));
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
    if (err && err !== 'locked') return;
    
    if (err === 'locked' || !cred || cred.lockedUntil) {
      console.log('waiting for twitter credential to unlock')
      waitForTwitterCredentialToUnlock(job, (err) => err ? cb(err) : secureTwitterCredential(job, cb));
    } else {
      return cb(err, cred);  
    }
  })
}

function waitForTwitterCredentialToUnlock(job, cb) {
  if (!job) return cb('missing required job');
  queryTwitterCredential(job, function(err, cred) {
    if (err) return cb(err);
    if (!cred) return cb('Could not find twitter credentials');
    if (!cred.lockedUntil || isNaN(cred.lockedUntil)) return cb(undefined);
    
    const wait = cred.lockedUntil - new Date().getTime() + 1000;
    console.log('wait time for credential, ', wait);

    // Await unlocking
    setTimeout(() => { cb(undefined) }, wait);  
  })
}

function getResetTimeForTwitterCredential(rateLimit) {
  return Math.max(
    getFriendsRateLimitReset(rateLimit),
    getFollowersRateLimitReset(rateLimit),
    getApplicationRateLimitReset(rateLimit)
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
  console.log('lock twitter credential');
  console.log($update);
  
  const interval = reset - new Date().getTime();
  console.log(`locking twitter credential, will unlock in ${interval} ms`);
  
  TwitterCredential.findOneAndUpdate($query, $update, {new: true}, (err, cred) => {
    if (err) return cb(err);
    scheduleTwitterCredentialUnlock(cred, interval)
    return cb(err, cred);
  });
}

function updateIntegrationUserInProcess(jobID, user, cb) {
  if (!jobID || !user) return cb('missing required data');
  const $query = {_id : jobID};
  const $update = {$set: {inProcess: user}};
  TwitterIntegrationJob.update($query, $update, err => cb(err));
}

function incrementIntegrationCompleted(jobID, cb) {
  if (!jobID) return cb('missing required data');
  const $query = {_id : jobID};
  const $update = {$inc: {completed: 1}};
  TwitterIntegrationJob.update($query, $update, err => cb(err));
}

function processIntegrationUserList(job, cb) {
  if (!job) return cb('missing required twitter job');
  const userList = job.userList.slice(); // Slice the data
  const { teamId, neo4jCredentials } = job;
  const jobId = job.id;

  async.eachSeries(userList, function(user, cb) {
    const { twitterID } = user;
    const userId = user.id;
    console.log(`processing user ${user.name}`);
    
    // Grab available credentials before starting
    secureTwitterCredential(job, function(err, twitterCred) {
      const updateUser = cb => updateIntegrationUserInProcess(jobId, user, cb);
      const getFriends = cb => getTwitterFriends({twitterID, twitterCred}, (err, friends=[]) => cb(undefined, friends));
      const setFriends = (friends=[], cb) => friends.length ? setUserFriendList({jobId, userId, friends}, err => cb(err, friends)) : cb(undefined, friends);
      const upsertFriends = (friends=[], cb) => upsertTwitterFriends({neo4jCredentials, friends, twitterID}, cb);
      const getFollowers = cb => getTwitterFollowers({twitterID, twitterCred}, (err, followers=[]) => cb(undefined, followers));
      const setFollowers = (followers=[], cb) => followers.length? setUserFollowerList({jobId, userId, followers}, err => cb(err, followers)) : cb(undefined, followers);
      const upsertFollowers = (followers=[], cb) => upsertTwitterFollowers({neo4jCredentials, followers, twitterID}, cb);
      const incCompleted = cb => incrementIntegrationCompleted(jobId, cb);
      
      const pipeline = [
        updateUser,
        getFriends,
        setFriends,
        upsertFriends,
        getFollowers,
        setFollowers,
        upsertFollowers,
        incCompleted
      ];

      async.waterfall(pipeline, err => {
        console.log(`finished processing user ${user.name}`);
        cb(err);
      })
    });
  }, cb);
}

function runTwitterIntegration(job, cb) {
  if (!job) { return }

  const setJobInProcess = (job, cb) => updateJobStatus({jobId: job.id, status: 'inProgress', msg: 'rolling along nicely'}, cb);
  
  const pipeline = [
    cb => cb(undefined, job),
    setJobInProcess,
    getIntegrationUserList,
    processIntegrationUserList
  ];

  async.waterfall(pipeline, function(err, data) {
    if (err) {
      // Integration has failed, log the error message;
      return updateJobStatus({jobId: job.id, status: 'failed', msg: err}, cb);
    } else {
      return updateJobStatus({jobId: job.id, status: 'success', msg: 'Integration completed'}, cb);
    }
  });
}

function createTwitterIntegrationJob(teamModel, cb) {
  if (!teamModel) { 
    return cb("missing required team");
  }

  const pipeline = [
    cb => checkExistingTwitterIntegrationJob(teamModel.id, (err, exists) => exists ? cb(twitterIntegrationInProgressMsg) : cb(err)),
    cb => buildNewTwitterIntegrationJob(teamModel, cb)
  ];

  async.waterfall(pipeline, function(err, twitterIntegrationJob) {
    if (err) {
      switch(err) {
        case twitterIntegrationInProgressMsg:
          return cb(twitterIntegrationInProgressMsg);
        default: 
          return cb(twitterIntegrationErrMsg);
      }
    }
    
    // kick off cron job in 1 second
    startCronJob(1);
    
    // Return the new twitter sync job to the cb
    return cb(err, twitterIntegrationJob);
  });
}

function buildNewTwitterIntegrationJob(teamModel, cb) {
  if (!teamModel) {
    return cb('missing required team model');
  }
  
  const props = Object.assign({}, {
    teamId: teamModel.id,
    neo4jCredentials: teamModel.neo4jCredentials
  });
  
  const twitterIntegrationJob = TwitterIntegrationJob(props);
  twitterIntegrationJob.save(err => cb(err, twitterIntegrationJob));
}

function checkExistingTwitterIntegrationJob(teamId, cb) {
  const $query = {teamId,  status: {'$ne': 'finished'}};
  const $proj = {'_id': 1};
  
  TwitterIntegrationJob
    .find($query, $proj)
    .lean()
    .exec((err, results = []) => cb(err, results.length > 0));    
}

module.exports = {
  createTwitterIntegrationJob
}
