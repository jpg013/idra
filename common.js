const Crypto   = require('crypto');
const Config   = require('./config');
const Mongoose = require('mongoose');

function encrypt(text) {
  var cipher = Crypto.createCipher(Config.cryptoAlgorithm, Config.cryptoSecret);
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  var decipher = Crypto.createDecipher(Config.cryptoAlgorithm, Config.cryptoSecret);
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

const generateObjectId = id => id ? Mongoose.Types.ObjectId(id) : Mongoose.Types.ObjectId();

module.exports = {decrypt, encrypt, generateObjectId};