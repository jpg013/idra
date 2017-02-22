const crypto   = require('crypto');
const config   = require('./config');
const mongoose = require('mongoose');

const decrypt = (string) => {
  const decipher = crypto.createDecipher(config.cryptoAlgorithm, config.authTokenSecret);
  let dec = decipher.update(string, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

const encrypt = (string) => {
  var cipher = crypto.createCipher(config.cryptoAlgorithm, config.authTokenSecret);
  var crypted = cipher.update(string, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

const generateObjectId = () => mongoose.Types.ObjectId();

module.exports = {decrypt, encrypt, generateObjectId};