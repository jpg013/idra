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
  const {jobId, status} = opts;
  const $opts = {upsert: true, new: true };
  const $query = {_id: jobId};
  const $set = {$set: {'status': status}};
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

const getTwitterClient = creds => new Twitter(decryptTwitterCredentials(creds));

const updateTwitterRateLimit = (job, cb) => {
  const twitterClient = buildTwitterClient(job.twitterCredentials);

  twitterClient.get('application/rate_limit_status', function(err, results) {
    if (err) return cb(err);
    if (!results) return cb('error getting rate limit');
    
    const friends = {
      remaining: results.resources.friends['/friends/list'].remaining,
      reset: results.resources.friends['/friends/list'].reset
    };

    const followers = {
      remaining: results.resources.followers['/followers/list'].remaining,
      reset: results.resources.followers['/followers/list'].reset
    };

    const rateLimit = {
      friends: friends,
      followers: followers
    };

    const $opts = {upsert: true, new: true };
    const $query = {_id: job.id};
    const $set = {$set: {rateLimit: rateLimit}};

    TwitterSyncJob.findOneAndUpdate($query, $set, $opts, cb)    
  })
}

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

function getTwitterFollowers(job, screenName, cb) {
  const {twitterCreds, twitterID} = opts;
  if (!twitterCreds || !twitterID) return cb('missing required options');

  const twitterClient = getTwitterClient(twitterCreds);
  
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
  const {twitterCreds, twitterID} = opts;
  if (!twitterCreds || !twitterID) return cb('missing required options');

  const twitterClient = getTwitterClient(twitterCreds);
  
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

function getFriendsRateCredentialReset(twitterCred) {
  if (!twitterCred || !twitterCred.rateLimit || typeof twitterCred.rateLimit.friends !== 'object') {
    return
  }
  
  const friendsReset = twitterCred.rateLimit.friends.reset;
  
  /* The reset seems to be in seconds whereas the getTime returns ms so doing a conversion on the fly */
  const adjustedReset = friendsReset - (new Date().getTime() / 1000) + 1000; // Add 1000 ms for padding
  
  if (adjustedReset < 0) { return MAX_RATE_LIMIT_WINDOW; }
  return Math.min(MAX_RATE_LIMIT_WINDOW, adjustedReset);
}

function getFollowersRateCredentialReset(twitterCred) {
  if (!twitterCred || !twitterCred.rateLimit || typeof twitterCred.rateLimit.followers !== 'object') {
    return
  }
  
  const followersReset = twitterCred.rateLimit.followers.reset;
  
  /* The reset seems to be in seconds whereas the getTime returns ms so doing a conversion on the fly */
  const adjustedReset = followersReset - (new Date().getTime() / 1000) + 1000; // Add 1000 ms for padding
  
  if (adjustedReset < 0) { return MAX_RATE_LIMIT_WINDOW; }
  return Math.min(MAX_RATE_LIMIT_WINDOW, adjustedReset);
}

function getRateCredentialsResetTime(teamId, cb) {
  if (!teamId) return cb('missing required team id');
  const $query = {
    '$and': [
      {
        '$or': [
          {teamId: teamId},
          {isPublic: true}
        ]
      },
      { 'rateLimit': {$exists: true} },
      { 'inUse': { $eq: false }}
    ]
  };

  const $fields = { rateLimit: 1 };

  TwitterCredential.find($query, $fields, function(err, results=[]) {
    if (err) return cb(err);
    if (!results.length) {
      /* We have no available rate limits b/c all are in use, set 10s timeout and try again */
      setTimeout(() => getRateCredentialsResetTime(teamId, cb), 10000);
    } else {
      const resetTimes = results.map(cur => {
        return Math.max(
          getFriendsRateCredentialReset(cur),
          getFollowersRateCredentialReset(cur)  
        );
      })
      const minWait = Math.min(...resetTimes);
      return cb(err, minWait);
    }
  })
}

function waitForTwitterCredentials(teamId, cb) {
  console.log('WAITING FOR TWITTER CREDENTIALS');
  getRateCredentialsResetTime(teamId, function(err, wait) {
    if (err) return cb(err);
    if (isNaN(wait)) {
      return cb('wait is not a valid time period');
    }
    setTimeout(() => getTwitterCredentials(teamId, cb), wait);
  });
}

function getTwitterCredentials(teamId, cb) {
  if (!teamId) return cb('missing required team id');
  const $query = {
    '$and': [
      {
        '$or': [
          {teamId: teamId},
          {isPublic: true}
        ]
      },
      { 'rateLimit': {$exists: true} },
      { 'rateLimit.friends.remaining': {$gt: 1}},
      { 'rateLimit.followers.remaining': {$gt: 1}},
      { 'inUse': { $eq: false }}
    ]
  };
  const $fields = {
    consumer_key: 1,
    consumer_secret: 1,
    access_token_key: 1,
    access_token_secret: 1
  };
  const $sort = { 'lastUsedTimestamp': 1};
  const $update = { $set: {'inUse': true} };

  const $opts = {
    fields: $fields,
    sort: $sort,
    new: true,
  };
  
  TwitterCredential.findOneAndUpdate($query, $update, $opts, (err, results) => {
    if (err) return cb(err);
    if (results) {
      return cb(err, results);
    } else {
      /* No available rate limits right now */
      waitForTwitterCredentials(teamId, cb);  
    }
  });
}

function updateIntegrationUserInProcess(jobID, user, cb) {
  if (!jobID || !user) return cb('missing required data');
  const $query = {_id : jobID};
  const $update = {$set: {inProcess: user}};
  TwitterIntegrationJob.update($query, $update, cb);
}

function incrementIntegrationCompleted(jobID, cb) {
  if (!jobID) return cb('missing required data');
  const $query = {_id : jobID};
  const $update = {$inc: {completed: 1}};
  TwitterIntegrationJob.update($query, $update, cb);
}

function processIntegrationUserList(job, cb) {
  if (!job) return cb('missing required twitter job');
  const userList = job.userList.slice(); // Slice the data
  const { teamId, neo4jCredentials } = job;
  const jobId = job.id;

  const getJob = cb => TwitterIntegrationJob.find({_id: jobID}, (err, results=[]) => cb(err, results[0]));

  async.eachSeries(userList, function(user, cb) {
    const { twitterID } = user;
    const userId = user.id;

    // Grab available credentials before starting
    getTwitterCredentials(teamId, function(err, twitterCreds) {
      const getFriends = cb => getTwitterFriends({twitterID, twitterCreds}, cb);
      const setFriends = (friends, cb) => setUserFriendList({jobId, userId, friends}, err => cb(err, friends));
      const upsertFriends = (friends, cb) => upsertTwitterFriends({neo4jCredentials, friends, twitterID}, cb);
      const getFollowers = cb => getTwitterFollowers({twitterID, twitterCreds}, cb);
      const setFollowers = (followers, cb) => setUserFollowerList({jobId, userId, followers}, err => cb(err, followers));
      const upsertFollowers = (followers, cb) => upsertTwitterFollowers({neo4jCredentials, followers, twitterID}, cb);
      return;
      const pipeline = [
        updateIntegrationUserInProcess,
        getFriends,
        setFriends,
        upsertFriends,
        getFollowers,
        setFollowers,
        upsertFollowers,
        updateTwitterCredentialRateLimit,
        incrementIntegrationCompleted
      ];

      async.waterfall(pipeline, err => {
        console.log('finished processing user list');
        console.log(err);
      })
    });
  }, cb);
}

function runTwitterIntegration(job, cb) {
  if (!job) { return }

  const setJobInProcess = (job, cb) => updateJobStatus({jobId: job.id, status: 'inProgress'}, cb);
  
  const pipeline = [
    cb => cb(undefined, job),
    setJobInProcess,
    getIntegrationUserList,
    processIntegrationUserList
  ];

  async.waterfall(pipeline, function(err, data) {
    console.log('finished running integration');
    console.log(err);
    console.log(data);
    cb();
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
