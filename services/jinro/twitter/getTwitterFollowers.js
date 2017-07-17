const getTwitterClient = require('./getTwitterClient');

const getTwitterFollowers = (opts, cb) => {
  const {twitterCredential, twitterID} = opts;
  if (!twitterCredential || !twitterID) {
    return cb('missing twitter credential or twitter id');
  }

  const twitterClient = getTwitterClient(twitterCredential);

  const params = {
    screen_name: twitterID,
    count: 200
  };
  
  twitterClient.get('followers/ids', params, function(err, results = []) {
    if (err) {
      return cb(err);
    }
    /*
      { 
        ids: [ 305651714, 2446252386 ],
        next_cursor: 0,
        next_cursor_str: '0',
        previous_cursor: 0,
        previous_cursor_str: '0' 
      }
    */
    const followers = results.ids.map(cur => ({mediaId: cur}));
    return cb(err, followers);
  });
}

module.exports = getTwitterFollowers;