const Team                   = require('../models/team.model');
const TwitterCredential      = require('../models/twitter-credential.model');
const cryptoClient           = require('../common/crypto');
const async                  = require('async');
const ReportFactory          = require('../factories/report.factory');
const TeamFactory            = require('../factories/team.factory');

/**
 * Constants
 */
const addTeamErrMsg = 'There was an error creating the team';
const invalidTeamDataErrMsg = 'Invalid team data';
const invalidReportDataErrMsg = 'Invalid report data';
const invalidReportSetDataErrMsg = 'Invalid report set data';
const teamDoesNotExistErrMsg = 'Team does not exists';
const teamExistsErrMsg = 'Team name already exists.';
const addReportErrMsg = 'There was an error creating the report';
const addReportSetErrMsg = 'There was an error creating the report set';

const canDeleteTeam = teamModel => {
  return teamModel.userCount === 0;
}

const doesTeamNameExist = (name, cb) => {
  queryTeams({name}, (err, teams) => {
    return cb(err, teams.length > 0);
  });
}

const queryTeams = (query, cb) => {
  Team
    .find(query)
    .exec((err, results = []) => {
      if (err) return cb(err);
      const teams = results.map(cur => cur.clientProps);
      return cb(err, teams);
    });
}

const findTeam = (id, cb) => {
  Team.findOne({_id: id}, function(err, result) {
    return cb(err, result);
  });
}

const deleteTeam = (id, cb) => {
  Team.findByIdAndRemove(id, cb);
}

const createTeam = (data, cb) => {
  const scrubbedTeamData = TeamFactory.scrubTeamData(data);
  if (!TeamFactory.validateTeamFields(scrubbedTeamData)) {
    return cb(invalidTeamDataErrMsg);
  }

  const teamModel = TeamFactory.buildTeamModel(scrubbedTeamData);

  const pipeline = [
    cb => cb(undefined, teamModel),
    (teamModel, cb) => doesTeamNameExist(teamModel.name, (err, teamExists) => cb(err, teamModel, teamExists)),
    (teamModel, teamExists, cb) => teamExists ? cb(teamExistsErrMsg) : teamModel.save(err => cb(err, teamModel)),
    (teamModel, cb) => findTeam(teamModel.id, cb)
  ];

  async.waterfall(pipeline, (err, teamModel) => cb(err, teamModel));
} 

const updateTeam = (teamId, data, cb) => {
  const { name, neo4jAuth, neo4jConnection } = data;
  const $set = { name, neo4jAuth, neo4jConnection };
  Team.findOneAndUpdate({_id: teamId}, {$set}, {new: true}, cb);
}

function createReportSet(data, cb) {
  const scrubbedData = ReportFactory.scrubReportSetData(data);
  if (!ReportFactory.validateReportSetFields(scrubbedData)) {
    return cb(invalidReportSetDataErrMsg);
  }

  const reportSetModel = ReportFactory.buildReportSetModel(scrubbedData);

  const $query = { '_id': reportSetModel.teamId }
  const $update = { '$push': { 'reportSets' : reportSetModel } }
  const $opts = {upsert: true, new: true };

  Team.update($query, $update, $opts, (err) => cb(err, reportSetModel));
}

function createReport(data, cb) {
  const scrubbedData = ReportFactory.scrubReportData(data);
  if (!ReportFactory.validateReportFields(scrubbedData)) {
    return cb(invalidReportDataErrMsg);
  } 
  const reportModel = ReportFactory.buildReportModel(scrubbedData);
  
  const $query = { 
    '_id': reportModel.teamId,
    'reportSets': { '$elemMatch': { '_id' : reportModel.reportSetId } } 
  };

  const $update = { $push: {'reports': reportModel} }
  const $opts = {upsert: true, new: true }

  Team.findOneAndUpdate($query, $update, $opts, (err, updatedTeamModel) => {
    if (err) {
      return cb('There was an error saving the report');   
    }
    const persistedReportModel = updatedTeamModel.findReport(reportModel.id);
    if (!persistedReportModel) {
      return cb('There was an error saving the report');   
    }
    return cb(err, persistedReportModel);
  });
}

function incrementUserCount(teamId, cb) {
  const $inc = {'$inc': {'userCount': 1}};
  Team.findByIdAndUpdate(teamId, $inc, cb);
}

function incrementReportDownloadCount(reportModel, cb) {
  if (!reportModel) return cb('missing required report');
  const $inc = { '$inc': { 'reports.$.downloadCount': 1 } }
  const $query = { '_id': reportModel.teamId, "reports._id": reportModel.id};
  Team.update($query, $inc, cb);
}

function setLastActivityDate(teamId, cb) {
  if (!teamId) {
    return cb('missing required team id');
  }
  const opts = {
    upsert: true,
    new: true
  };
  const $set = {
    '$set': {
      'lastActivityDate': new Date()
    }
  };
  Team.update({'_id': teamId}, $set, opts, cb);
}

function getReportList(cb) {
  const $query = {
    $where: "this.reportSets.length > 0"
  }
  Team
    .find($query, {reports: 1, reportSets: 1, name: 1})
    .exec(function(err, results = []) {
      if (err) return cb(err);
      
      const reportList = results.reduce((acc, cur) => {
        const reportCollection = cur.clientProps.reportCollection;
        return acc.concat(reportCollection);
      }, []);
      return cb(err, reportList);
    });
}

function getTeamListData(cb) {
  const $projection = { _id: 1, name: 1 };
  
  Team
    .find({}, $projection)
    .lean()
    .exec(cb)
}

function createTwitterCredential(data, cb) {
  const { consumer_key, consumer_secret, access_token_key, access_token_secret } = data;
  if (!consumer_key || 
      !consumer_secret || 
      !access_token_key || 
      !access_token_secret ) {
        return cb('missing required data');
      }
  
  const twitterCredentialModel = new TwitterCredential({
    consumer_key: cryptoClient.encrypt(consumer_key),
    consumer_secret: cryptoClient.encrypt(consumer_secret),
    access_token_key: cryptoClient.encrypt(access_token_key),
    access_token_secret: cryptoClient.encrypt(access_token_secret)
  });
  
  twitterCredentialModel.save(cb);
}

function updateTwitterCredential(data, cb) {
  const { consumer_key, consumer_secret, access_token_key, access_token_secret } = data;
  if (!consumer_key || 
      !consumer_secret || 
      !access_token_key || 
      !access_token_secret,
      id ) {
        return cb('missing required data');
      }
  
  const $query = { 'twitterCredentials.$._id': id };
  const $update = { $set: {
    consumer_key: cryptoClient.encrypt(consumer_key),
    consumer_secret: cryptoClient.encrypt(consumer_secret),
    access_token_key: cryptoClient.encrypt(access_token_key),
    access_token_secret: cryptoClient.encrypt(access_token_secret)
  } };
  const $opts = { upsert: true };
  TwitterCredentialModel.update($query, $update, $opts, cb);
}

module.exports = {
  canDeleteTeam,
  queryTeams,
  deleteTeam,
  createTeam,
  updateTeam,
  doesTeamNameExist,
  findTeam,
  createReport,
  createReportSet,
  incrementUserCount,
  incrementReportDownloadCount,
  setLastActivityDate,
  getReportList,
  getTeamListData,
  createTwitterCredential,
  updateTwitterCredential
};