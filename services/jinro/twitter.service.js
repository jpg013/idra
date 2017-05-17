'use strict';

/**
 * Module dependencies.
 */
const Twitter            = require('twitter');
const CryptoClient       = require('../../common/crypto');

/*
 * Max Twitter Rate Limit Window
 */
const MAX_RATE_LIMIT_WINDOW = 900000; // 15 minutes

/**
 * Returns new Twitter instance, requires twitter access tokens
 */
function getTwitterClient(twitterCredential) {
  return new Twitter(decryptTwitterCredentials(twitterCredential));
}

/**
 * Helper function to decrypt Twitter Credential
 */
function decryptTwitterCredentials(twitterCredential) {
  const { consumer_key, consumer_secret, access_token_key, access_token_secret} = twitterCredential;
  return {
    consumer_key: CryptoClient.decrypt(consumer_key),
    consumer_secret: CryptoClient.decrypt(consumer_secret),
    access_token_key: CryptoClient.decrypt(access_token_key),
    access_token_secret: CryptoClient.decrypt(access_token_secret)
  }
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

/*
 * Parse Error Message From Twitter
 */
function parseTwitterError(err) {
  if (!err) return;
  const errorCode = Array.isArray(err) ? (err[0] && err[0].code) : err.code;
  switch(errorCode) {
    case 89:
      return 'Twitter access token is invalid.'
    default:
      return
  }
}

function getRateLimitStatus(twitterCred, cb) {
  if (!twitterCred) return cb('missing required twitter creds');
  const twitterClient = getTwitterClient(twitterCred);
  
  twitterClient.get('application/rate_limit_status', function(err, results = []) {
    if (err) {
      return cb(parseTwitterError(err));
    }
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

module.exports = {
  getRateLimitStatus,
  getTwitterFollowers,
  getTwitterFriends,
  getApplicationRateLimitReset,
  getFriendsRateLimitReset,
  getFollowersRateLimitReset
};
