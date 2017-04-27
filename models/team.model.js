const mongoose           = require('mongoose');
const Schema             = mongoose.Schema;
const TwitterCredentials = require('./twitter-credentials.model');

const teamSchema = new Schema({
  name               : {type: String, required: true},
  reportCollections  : [{type: mongoose.Schema.Types.ObjectId, ref: 'ReportCollection'}],
  createdDate        : {type: Date, default: Date.now},
  userCount          : {type: Number, default: 0},
  lastActivityDate   : {type: Date},
  imageURL           : {type: String},
  downloadCount      : {type: Number, default: 0},    
  twitterCredentials : {
    consumerKey: {type: String},
    consumerSecret: {type: String},
    accessTokenKey: {type: String},
    accessTokenSecret: {type: String},
  },
  neo4jCredentials : {
    connection: {type: String, required: true},
    auth: {type: String, required: true}
  }
});

/**
 * Schema
 */
teamSchema.virtual('id').get(function() {
  return this._id.toString();
});

teamSchema.virtual('clientProps').get(function() {
  const  { name, createdDate, userCount, lastActivityDate, imageURL, downloadCount } = this;
  const reportCollections = this.reportCollections.map(cur => cur.clientProps);
  return { name, createdDate, userCount, lastActivityDate, imageURL, downloadCount, reportCollections }
})

module.exports = mongoose.model('Team', teamSchema);
