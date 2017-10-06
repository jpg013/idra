
//login - jim.morgan@innosolpro.com
//password - Devaccess2017**
//const AUTH_CLIENT_SECRET="bZhXvvisxvJrcWJEGWrdvuOMPvmyQn3liNnr51Q/xFk=";
//const AUTH_REDIRECT_URI="http://localhost/api/institutions/auth/callback";
//const AUTH_CLIENT_ID="d57a55fb-cbfd-4c65-affa-537ae5756d31";
//const AUTH_SUBSCRIPTION_KEY="8c590a0498e84e86a5ac722b4a192d9c";

const getOauth2Client = require('../oauth2/getClient');

const getAuthUrl = creds => {
  const { 
    blackbaudClientId, 
    blackbaudClientSecret, 
    state 
  } = creds;

  const oauthClient = getOauth2Client(blackbaudClientId, blackbaudClientSecret);
    
  return oauthClient.authorizationCode.authorizeURL({
    redirect_uri: 'http://localhost:3000/blackbaud/auth/callback',
    state
  });
}


  /*
oauth2 = require('simple-oauth2')({
  clientID: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  authorizationPath: '/authorization',
  site: 'https://oauth2.sky.blackbaud.com',
  tokenPath: '/token'
});
*/

module.exports = getAuthUrl;
