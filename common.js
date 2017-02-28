const Crypto    = require('crypto');
const Config    = require('./config');
const Mongoose  = require('mongoose');
const user      = require('./models/user.model');
const tear      = require('./models/team.model');

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

const findUser = (query, cb) => user.findOne(query).populate('team').exec(cb);
const findTeamById = (id, cb) => team.findById(id, cb);
const generateObjectId = id => id ? Mongoose.Types.ObjectId(id) : Mongoose.Types.ObjectId();

const lookupTeamReport = (team, reportSetId, reportId) => {
  if (!team || !reportSetId || !reportId) return;
  const reportSet = team.reportSets.find(cur => cur.id === reportSetId);
  if (!reportSet) return;
  return reportSet.reports.find(cur => cur.id === reportId);
}

module.exports = {
  decrypt,
  encrypt,
  generateObjectId,
  findUser,
  findTeamById,
  lookupTeamReport
};