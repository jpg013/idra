const Twitter = require('twitter');

const getClient = twitterCredential => {
  return new Twitter({
    consumer_key: twitterCredential.consumerKey,
    consumer_secret: twitterCredential.consumerSecret,
    access_token_key: twitterCredential.accessTokenKey,
    access_token_secret: twitterCredential.accessTokenSecret
  });
}

module.exports = getClient;