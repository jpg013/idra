const encrypt = require('../helpers/encrypt');

const makeAccessSecretQueryParam = () => {
  return `access_secret=${encrypt(process.env.SERVICE_ACCESS_SECRET)}`;
};

module.exports = makeAccessSecretQueryParam;
