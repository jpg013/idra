const encrypt = require('../helpers/encrypt');

const makeAccessSecretQueryParam = () => {
  const encryptedSecret = encrypt(process.env.ACCESS_SECRET)
  return `access_secret=${encryptedSecret}`;
};

module.exports = makeAccessSecretQueryParam;
