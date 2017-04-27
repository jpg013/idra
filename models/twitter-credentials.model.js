// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema      = mongoose.Schema;

const TwitterCredentialsSchema = new Schema({
  consumerKey: String,
  consumerSecret: String,
  accessTokenKey: String,
  accessTokenSecret: String
});

module.exports = mongoose.model('TwitterCredentials', TwitterCredentialsSchema);


