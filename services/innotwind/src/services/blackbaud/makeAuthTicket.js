const getOauth2Client = require('./getOauth2Client');

const getAuthTicket = (code, clientId, clientSecret, cb) => {
  const ticketConfig = {
    code,
    redirect_uri: process.env.BLACKBAUD_AUTH_REDIRECT_URL || 'http://localhost:3000/blackbaud/auth/callback',
  };

  const oauth2 = getOauth2Client(clientId, clientSecret);

  oauth2.authorizationCode.getToken(ticketConfig, (err, result) => {
    if (err || !result) {
      return cb(err);
    }

    const accessToken = oauth2.accessToken.create(result);
    return cb(err, accessToken.token);
  });
}

module.exports = getAuthTicket;