const getTwitterRateLimit = require('./getTwitterRateLimit');
const async               = require('async');

// Max Twitter Rate Limit Window
const MAX_RATE_LIMIT_WINDOW = 900000; // 15 minutes

function isRateLimitExceeded(rateLimit) {
  return (
    rateLimit.friends.remaining < 1 || 
    rateLimit.followers.remaining < 1 || 
    rateLimit.application.remaining < 1
  );
}

const secureTwitterCredential = (integrationModel, cb) => {
  if (!integrationModel) {
    return cb('An Integration Model is required to secure a twitter credential.');
  }

  const twitterCredential = integrationModel.socialMediaCredential;

  const pipeline = [
    next => {
      if (!twitterCredential) {
        return next('The twitter credential for this integration is invalid.');
      }
      getTwitterRateLimit(twitterCredential, (err, rateLimit) => {
        next(err, rateLimit)
      })
    },
    (rateLimit, next) => {
      if (!isRateLimitExceeded(rateLimit)) {
        return next(undefined, twitterCredential);
      } else {
        const resetTime = getResetTimeForTwitterCredential(rateLimit);
        return next('rateLimited', resetTime);
      }
    }
  ];

  async.waterfall(pipeline, function(err, results) {
    if (err && err !== 'rateLimited') {
      console.log('a critical error occurred while securing a twitter credential - ', err);
      return cb(err);
    }
    if (err === 'rateLimited') {
      waitForRateLimitToExpire(integrationModel, results, cb);  
    } else {
      return cb(err, results);
    }
  });
}

function waitForRateLimitToExpire(integrationModel, rateLimitExpire, cb) {
  console.log('waiting for rate limit to expire at ', new Date(rateLimitExpire).toLocaleString());  
  const wait = rateLimitExpire - new Date().getTime() + 1000;
  // Await rate limit expire
  setTimeout(() => {
    console.log('we have awoken from rate limiting!!!');
    secureTwitterCredential(integrationModel, cb)
  }, wait);
}

function getResetTimeForTwitterCredential(rateLimit) {
  return Math.max(
    getFriendsRateLimitReset(rateLimit),
    getFollowersRateLimitReset(rateLimit),
    getApplicationRateLimitReset(rateLimit)
  );
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

module.exports = secureTwitterCredential;