const getTwitterClient  = require('./getTwitterClient');
const parseTwitterError = require('./parseTwitterError');

const getTwitterRateLimit = (twitterCredential, cb) => {
  if (!twitterCredential) {
    return cb('missing required twitter credential');
  }

  const twitterClient = getTwitterClient(twitterCredential);

  twitterClient.get('application/rate_limit_status', function(err, results = []) {
    if (err) {
      return cb(parseTwitterError(err));
    }
    //console.log(results.resources.users);
    const friends = {
      remaining: results.resources.friends['/friends/ids'].remaining,
      reset: results.resources.friends['/friends/ids'].reset
    };

    const followers = {
      remaining: results.resources.followers['/followers/ids'].remaining,
      reset: results.resources.followers['/followers/ids'].reset
    };

    const application = {
      remaining: results.resources.application['/application/rate_limit_status'].remaining,
      reset: results.resources.application['/application/rate_limit_status'].reset
    }

    return cb(err, {friends, followers, application});
  });
}

module.exports = getTwitterRateLimit;