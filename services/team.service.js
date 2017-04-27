const Team           = require('../models/team.model');
const cryptoClient   = require('../common/crypto');
const async          = require('async');
const ReportFactory  = require('../factories/report.factory');
const TeamFactory    = require('../factories/team.factory');

/**
 * Constants
 */
const addTeamErrMsg = 'There was an error creating the team';
const invalidTeamDataErrMsg = 'Invalid team data';
const invalidReportDataErrMsg = 'Invalid report data';
const invalidReportGroupDataErrMsg = 'Invalid report group data';
const teamDoesNotExistErrMsg = 'Team does not exists';
const teamExistsErrMsg = 'Team name already exists.';
const addReportErrMsg = 'There was an error creating the report';
const addReportGroupErrMsg = 'There was an error creating the report group';

const canDeleteTeam = teamModel => {
  return teamModel.userCount === 0;
}

const doesTeamNameExist = (name, cb) => {
  queryTeams({name}, (err, teams) => {
    return cb(err, teams.length > 0);
  });
}

const queryTeams = (query, cb) => {
  Team.find(query).exec(function(err, teamCollection) {
    return cb(err, teamCollection);
  });
}

const findTeam = (id, cb) => {
  Team.findOne({_id: id}, function(err, teamModel) {
    return cb(err, teamModel);
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

function createReportGroup(data, cb) {
  const scrubbedReportGroupData = ReportFactory.scrubReportGroupData(data);
  if (!ReportFactory.validateReportGroupFields(scrubbedReportGroupData)) {
    return cb(invalidReportGroupDataErrMsg);
  }

  const reportGroupModel = ReportFactory.buildReportGroupModel(scrubbedReportGroupData);

  const $query = { '_id': reportGroupModel.teamId }
  const $update = { '$push': { 'reportCollection' : reportGroupModel } }
  const $opts = {upsert: true, new: true }

  Team.update($query, $update, $opts, (err) => cb(err, reportGroupModel));
}

function createReport(data, cb) {
  const scrubbedData = ReportFactory.scrubReportData(data);
  if (!ReportFactory.validateReportFields(scrubbedData)) {
    return cb(invalidReportDataErrMsg);
  } 
  
  const reportModel = ReportFactory.buildReportModel(scrubbedData);
  const $query = { '_id': reportModel.teamId, 'reportCollection._id': reportModel.groupId }
  const $update = { $push: {'reportCollection.$.reports': reportModel} }
  const $opts = {upsert: true, new: true }

  Team.update($query, $update, $opts, cb);
}

function incrementUserCount(teamId, cb) {
  const $inc = {'$inc': {'userCount': 1}};
  Team.findByIdAndUpdate(teamId, $inc, cb);
}

function incrementReportDownloadCount(data, cb) {
  const {reportModel, teamId} = data;
  if (!reportModel || !teamId) return cb('missing required data');

  const $inc = { 
    '$inc': { 
      'reportCollection.$.reports.$.downloadCount': 1  
    } 
  }
  
  const $query = {
    '_id': teamId,
    'reportCollection._id': reportModel.groupId,
    'reportCollection.reports._id': reportModel.id
  };
  
  Team.find($query, function(err, results) {
    console.log(err);
    console.log(results);
  });  
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

module.exports = {
  canDeleteTeam,
  queryTeams,
  deleteTeam,
  createTeam,
  updateTeam,
  doesTeamNameExist,
  findTeam,
  createReport,
  createReportGroup,
  incrementUserCount,
  incrementReportDownloadCount,
  setLastActivityDate
};