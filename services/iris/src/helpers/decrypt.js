const crypto = require('crypto');

const decrypt = text => {
  let decrypted;
  try {
    let textParts = text.split(':');
    let iv = new Buffer(textParts.shift(), 'hex');
    let encryptedText = new Buffer(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, new Buffer(process.env.CRYPTO_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString();
  } catch(e) {
    return;
  }
};

module.exports = decrypt;
