const getOauth2Client = require('../oauth2/getClient');

const getAuthTicket = (code, creds, cb) => {
  const { 
    blackbaudClientId, 
    blackbaudClientSecret, 
  } = creds;
  
  const ticketConfig = {
    code,
    redirect_uri: 'http://localhost:3000/blackbaud/auth/callback',
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

module.exports = getAuthTicket;