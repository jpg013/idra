const getOauth2Client = require('./getOauth2Client');

const makeAuthCodeToken = (code, blackbaudClientId, blackbaudClientSecret, cb) => {
  const ticketConfig = {
    code,
    redirect_uri: process.env.BLACKBAUD_AUTH_REDIRECT_URL, // 'http://localhost:3000/blackbaud/auth/callback',
  };

  const oauth2 = getOauth2Client(blackbaudClientId, blackbaudClientSecret);

  oauth2.authorizationCode.getToken(ticketConfig, (err, result) => {
    if (err || !result) {
      return cb(err);
    }

    const accessToken = oauth2.accessToken.create(result);
    return cb(err, accessToken.token);
  });
}

module.exports = makeAuthCodeToken;
