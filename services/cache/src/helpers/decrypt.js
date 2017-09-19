const crypto = require('crypto');

const decrypt = text => {
  let decipher = crypto.createDecipher(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_SECRET);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

module.exports = decrypt;
