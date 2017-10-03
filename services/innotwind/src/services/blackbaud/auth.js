const AUTH_CLIENT_ID="d57a55fb-cbfd-4c65-affa-537ae5756d31";
const AUTH_CLIENT_SECRET="bZhXvvisxvJrcWJEGWrdvuOMPvmyQn3liNnr51Q/xFk=";
const AUTH_REDIRECT_URI="http://localhost:5000/auth/callback";
const AUTH_SUBSCRIPTION_KEY="8c590a0498e84e86a5ac722b4a192d9c";
const PORT=5000;

const credentials = {
  client: {
    id: AUTH_CLIENT_ID,
    secret: AUTH_CLIENT_SECRET
  },
  auth: {
    tokenPath: '/authorization',
    tokenHost: 'https://oauth2.sky.blackbaud.com'
  }
}

const oauth2 = require('simple-oauth2').create(credentials);

const authenticate = () => {
  return;
  const username = 'jim.morgan@innosolpro.com';
  const password = "Devaccess2017**";

  const tokenConfig = {
    username,
    password
  };
  console.log(tokenConfig)

  oauth2.ownerPassword.getToken(tokenConfig, (error, result) => {
    console.log(error);
    console.log(result);
  });
}


module.exports = authenticate