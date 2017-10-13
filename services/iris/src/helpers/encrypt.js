const crypto = require('crypto');

const encrypt = text => {
  let encrypted;

  try {
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, new Buffer(process.env.CRYPTO_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch(e) {
    return text;
  }
};

module.exports = encrypt;
