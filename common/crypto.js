const crypto       = require('crypto');

function encrypt(text) {
  let cipher = crypto.createCipher(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_SECRET);
  let crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  let decipher = crypto.createDecipher(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_SECRET);
  let dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

module.exports = {
  encrypt,
  decrypt
}