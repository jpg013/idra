'use strict';

/**
 * Module dependencies.
 */
const Twitter        = require('twitter');
const TwitterSyncJob = require('../models/twitter-sync-job.model');
const async          = require('async');
const CronJob        = require('cron').CronJob;
const CryptoClient   = require('../common/crypto');
const Idra           = require('./idra');

const twitterSyncErrMsg = "There was an error syncing with twitter";
const twitterSyncInProgressMsg = "Twitter sync currently in progress";

const MAX_RATE_LIMIT_WINDOW = 900000; // 15 minutes

function executePendingTwitterSyncJobs(cb) {
  TwitterSyncJob.find({status: 'pending'}, function(err, results = []) {
    if (err) {
      // Attempt again in 30 seconds;
      startCronJob(30);
      return cb();
    }
    
    async.each(results, function(job, eachCb) {
      executeJob(job, eachCb);
    }, cb)
  });
}

function onPendingJobsDone() {
  console.log('finished all cron jobs');
}


function startCronJob(delay = 1) {
  const startTime = new Date();
  startTime.setSeconds(startTime.getSeconds() + delay);
  return new CronJob(startTime, executePendingTwitterSyncJobs, onPendingJobsDone, true, 'America/Los_Angeles');
}


// Update the job status
const updateJobStatus = (job, cb) => {
  const $opts = {upsert: true, new: true };
  const $query = {_id: job.id};
  const $set = {$set: {'status': 'inprogress'}};
  TwitterSyncJob.findOneAndUpdate($query, $set, $opts, cb);
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

const buildTwitterClient = creds => {
  return new Twitter(decryptTwitterCredentials(creds));
}

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

    console.log('updated Twitter Rate Limit');

    const rateLimit = {
      friends: friends,
      followers: followers
    };

    console.log(rateLimit);

    const $opts = {upsert: true, new: true };
    const $query = {_id: job.id};
    const $set = {$set: {rateLimit: rateLimit}};

    TwitterSyncJob.findOneAndUpdate($query, $set, $opts, cb)    
  })
}

function getTwitterData(job, cb) {
  Idra.getTwitterScreenNames(job.neo4jCredentials, function(err, results) {
    if (err || !results) {
      return cb('there was an error getting twitter screen names');
    }
    
    const $opts = {upsert: true, new: true };
    const $query = {_id: job.id};
    const $set = {$set: {twitterData: results}};

    TwitterSyncJob.findOneAndUpdate($query, $set, $opts, cb)    
  });
}

function getTwitterFollowers(job, screenName, cb) {
  const twitterClient = buildTwitterClient(job.twitterCredentials);
  const params = { screen_name: screenName };
  const now = new Date().getTime();
  twitterClient.get('followers/list', params, function(err, results) {
    const elapsedTime = new Date().getTime() - now;
    console.log('elapsed time for followers/list : ', elapsedTime);
    if (err) {
      console.log('error getting friends list for', screenName);
      return cb(err);
    }
    if (!results || !results.users) return cb(undefined);

    const userList = results.users.map(cur => {
      const { screen_name, id } = cur
      return { screen_name, id }
    });
    
    const creds = {
      connection: CryptoClient.decrypt(job.neo4jCredentials.connection),
      auth: CryptoClient.decrypt(job.neo4jCredentials.auth),
    };
    
    const args = { screenName, userList, creds };
    const timeA = new Date().getTime();
    Idra.upsertManyAndFollowers(args, function(err) {
      const timeB = new Date().getTime();
      console.log('elapsed time for upsert many and followers : ', timeB - timeA);
      return cb(err, job);
    })
  });
}

function getTwitterFriends(job, screenName, cb) {
  const now = new Date().getTime();
  const twitterClient = buildTwitterClient(job.twitterCredentials);
  const params = { screen_name: screenName };
  twitterClient.get('friends/list', params, function(err, results) {
    const elapsedTime = new Date().getTime() - now;
    console.log('elapsed time for friends/list : ', elapsedTime);
    if (err) {
      console.log('error getting friends list for', screenName);
      return cb(err);
    }
    if (!results || !results.users) return cb(undefined);

    const userList = results.users.map(cur => {
      const { screen_name, id } = cur
      return { screen_name, id }
    });
    
    const creds = {
      connection: CryptoClient.decrypt(job.neo4jCredentials.connection),
      auth: CryptoClient.decrypt(job.neo4jCredentials.auth),
    };
    
    const args = { screenName, userList, creds };
    const timeA = new Date().getTime();
    Idra.upsertManyAndFriends(args, function(err) {
      const timeB = new Date().getTime();
      console.log('elapsed time for upsert many and friends : ', timeB - timeA);
      return cb(err, job);
    })
  })
}

function getTwitterFollowersRateLimitWait(rateLimit) {
  if (rateLimit.followers.remaining > 1) return 0;
  const adjustedReset = (rateLimit.followers.reset * 1000) - new Date().getTime() + 1000;
  
  if (adjustedReset < 0) {
    return MAX_RATE_LIMIT_WINDOW;
  }
  return Math.min(MAX_RATE_LIMIT_WINDOW, adjustedReset);
}

function getTwitterFriendsRateLimitWait(rateLimit) {
  if (rateLimit.friends.remaining > 1) return 0;
  const adjustedReset = (rateLimit.friends.reset * 1000) - new Date().getTime() + 1000;
  
  if (adjustedReset < 0) {
    return MAX_RATE_LIMIT_WINDOW;
  }
  return Math.min(MAX_RATE_LIMIT_WINDOW, adjustedReset);
}

function processTwitterData(twitterJob, cb) {
  const twitterData = twitterJob.twitterData.slice(); // Slice the data
  const jobId = twitterJob.id;

  const getJob = cb => TwitterSyncJob.find({_id: jobId}, (err, results) => cb(err, results[0]));
  
  function waitForAvailableRateLimits(job, cb) {
    updateTwitterRateLimit(job, function(err, updatedJob) {
      if (err) return cb(err);
      console.log(getTwitterFriendsRateLimitWait(updatedJob.rateLimit));
      console.log(getTwitterFollowersRateLimitWait(updatedJob.rateLimit));
      const wait = Math.max(
        getTwitterFriendsRateLimitWait(updatedJob.rateLimit),
        getTwitterFollowersRateLimitWait(updatedJob.rateLimit)
      );
      if (wait > 0) {
        console.log('we have to wait here!');
        console.log(wait);
        setTimeout(function() {
          waitForAvailableRateLimits(updatedJob, cb);
        }, wait);
        return;
      }
      cb(undefined, updatedJob);
    });
  }
  
  async.eachSeries(twitterData, function(data, eachCb) {
    const { TwitterID } = data;
    const pipeline = [
      cb => getJob(cb),
      (job, cb) => waitForAvailableRateLimits(job, cb),
      (job, cb) => getTwitterFriends(job, TwitterID, cb),
      (job, cb) => getTwitterFollowers(job, TwitterID, cb)
    ];
    async.waterfall(pipeline, err => {
      console.log(err);
      eachCb(undefined);
    });
  }, cb);
}

function executeJob(job, cb) {
  if (!job) { return }

  const initPipeline = cb => cb(undefined, job);
  
  const pipeline = [
    initPipeline,
    updateJobStatus,
    getTwitterData,
    processTwitterData
  ];

  async.waterfall(pipeline, function(err, data) {
    console.log(err);
    console.log(data);
  });
}

function createTwitterSyncJob(teamModel, cb) {
  if (!teamModel) { 
    return cb("missing required team");
  }

  checkIfJobExists(teamModel.id, function(err, exists) {
    if (err) return cb(twitterSyncErrMsg)
    if (err) return cb(twitterSyncInProgressMsg);
  });

  const pipeline = [
    cb => checkIfJobExists(teamModel.id, cb),
    (jobExists, cb) => jobExists ? cb(twitterSyncInProgressMsg) : buildNewTwitterSyncJob(teamModel, cb)
  ];

  async.waterfall(pipeline, function(err, twitterJob) {
    if (err) {
      return (err === twitterSyncInProgressMsg) ?  cb(twitterSyncInProgressMsg) :  cb(twitterSyncErrMsg);
    }
    // Start a cron job to execute twitter sync job
    startCronJob(1);
    
    // Return the new twitter sync job to the cb
    return cb(err, twitterJob);
  });
}

function buildNewTwitterSyncJob(teamModel, cb) {
  const data = Object.assign({}, {
    teamId: teamModel.id,
    twitterCredentials: teamModel.twitterCredentials,
    neo4jCredentials: teamModel.neo4jCredentials
  });
  const twitterJob = TwitterSyncJob(data);
  twitterJob.save(err => cb(err, twitterJob));
}

function checkIfJobExists(teamId, cb) {
  const $query = {teamId,  status: {'$ne': 'finished'}};
  const $proj = {'_id': 1};
  
  TwitterSyncJob
    .find($query, $proj)
    .lean()
    .exec((err, results = []) => {
      return cb(err, results.length > 0);
    });    
}

module.exports = {
  createTwitterSyncJob
}
