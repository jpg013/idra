const getTwitterClient = require('./getTwitterClient');

function getTwitterUserProfile(opts, cb) {
  const {twitterCredential, twitterScreenName} = opts;
  if (!twitterCredential || !twitterScreenName) {
    return cb('missing twitter credential or twitter screen name');
  }

  const twitterClient = getTwitterClient(twitterCredential);
  const params = {
    screen_name: twitterScreenName,
  };
  
  twitterClient.get('users/show', params, function(err, results = {}) {
    if (err) {
      return cb(err);
    }
    return cb(err, results);
  });
}

module.exports = getTwitterUserProfile;