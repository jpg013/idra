const oauth2 = require('simple-oauth2')

module.exports = (id, secret) => {
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
