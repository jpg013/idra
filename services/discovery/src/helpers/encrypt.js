const crypto = require('crypto');

const encrypt = text => {
  let cipher = crypto.createCipher(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_SECRET);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

module.exports = encrypt;
