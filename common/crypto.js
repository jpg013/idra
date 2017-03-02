const crypto       = require('crypto');
const cryptoConfig = require('../config/crypto');

function encrypt(text) {
  let cipher = crypto.createCipher(cryptoConfig.cryptoAlgorithm, cryptoConfig.cryptoSecret);
  let crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  let decipher = crypto.createDecipher(cryptoConfig.cryptoAlgorithm, cryptoConfig.cryptoSecret);
  let dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

module.exports = {
  encrypt,
  decrypt
}