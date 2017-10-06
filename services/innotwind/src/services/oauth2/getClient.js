const oauth2 = require('simple-oauth2')

module.exports = (id, secret) => {
  // Set the configuration settings
  const credentials = {
    client: {
      id,
      secret
    },
    auth: {
      tokenHost: 'https://oauth2.sky.blackbaud.com',
      tokenPath: '/token',
      authorizePath: '/authorization'
    }
  };
  return oauth2.create(credentials);
};

/*
oauth2 = require('simple-oauth2')({
  clientID: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  authorizationPath: '/authorization',
  site: 'https://oauth2.sky.blackbaud.com',
  tokenPath: '/token'
});
*/