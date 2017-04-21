const Team           = require('../models/team.model');
const cryptoClient   = require('../common/crypto');
const reportsService = require('./reports.service');
const async          = require('async');

/**
 * Constants
 */
const addTeamErrMsg = 'There was an error creating the team';
const invalidTeamDataErrMsg = 'Invalid team data';
const invalidReportDataErrMsg = 'Invalid report data';
const invalidReportGroupDataErrMsg = 'Invalid report group data';
const teamDoesNotExistErrMsg = 'Team does not exists';
const teamExistsErrMsg = 'Team name already exists.'
const addReportErrMsg = 'There was an error creating the report';
const addReportGroupErrMsg = 'There was an error creating the report group';

const canDeleteTeam = teamModel => {
  return teamModel.userCount === 0;
}

function getSanitizedReportGroupData(data) {
  const {name, createdBy, createdById, teamId, teamName} = data;
  if (!name || name.trim().length < 3 || !createdBy || !createdById || !teamId || !teamName) {
    return false;
  }
  return {name, createdBy, createdById, teamId, teamName};
}

const getSanitizedReportData = data => {
  const { name, description, query, groupId, teamId, createdBy, createdById, teamName } = data;
  if (!name || !description || !query || !groupId || !teamId || !createdBy || !createdById || !teamName) { return; }
  return {name, description, query, groupId, teamId, createdBy , createdById, teamName};
}

const getSanitizedTeamData = (data) => {
  const { name, neo4jConnection, neo4jAuth, imageURL } = data;

  if (!name || name.trim().length < 3) {
    return false;
  }

  if (!neo4jConnection || !neo4jAuth) {
    return false;
  }
  return {name, neo4jConnection, neo4jAuth, imageURL};
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

function buildTeamModel(data) {
  const {name, neo4jConnection, neo4jAuth, imageURL} = data;
  const teamData = Object.assign({}, {
    name,
    neo4jConnection: cryptoClient.encrypt(neo4jConnection),
    neo4jAuth: cryptoClient.encrypt(neo4jAuth),
    imageURL,
    reports: [],
    createdDate: new Date(),
    userCount: 0
  });  
  return new Team(teamData);
}

const createTeam = (formData, cb) => {
  const sanitizedTeamData = getSanitizedTeamData(formData);
  if (!sanitizedTeamData) {
    return cb(invalidTeamDataMsg);
  }

  const teamModel = buildTeamModel(sanitizedTeamData);

  const createTeamPipeLine = [
    cb => doesTeamNameExist(teamModel.name, cb),
    (existingTeam, cb) => existingTeam ? cb(teamExistsErrMsg) : teamModel.save(err => cb(err)),
    cb => findTeam(teamModel.id, cb)
  ];

  async.waterfall(createTeamPipeLine, function(err, newTeamModel) {
    return err ? cb(err) : cb(undefined, newTeamModel);
  });
} 

const updateTeam = (teamId, data, cb) => {
  const { name, neo4jAuth, neo4jConnection } = data;
  const $set = { name, neo4jAuth, neo4jConnection };
  Team.findOneAndUpdate({_id: teamId}, {$set}, {new: true}, cb);
}

function createReportGroup(reportGroupData, cb) {
  const sanitizedReportGroupData = getSanitizedReportGroupData(reportGroupData);
  if (!sanitizedReportGroupData) {
    return cb(invalidReportGroupDataErrMsg);
  }

  const reportGroupModel = reportsService.buildReportGroupModel(sanitizedReportGroupData);

  const $query = { '_id': reportGroupModel.teamId }
  const $update = { '$push': { 'reportCollection' : reportGroupModel } }
  const $opts = {upsert: true, new: true }

  Team.update($query, $update, $opts, (err) => cb(err, reportGroupModel));
}

function createReport(reportData, cb) {
  const sanitizedReportData = getSanitizedReportData(reportData);
  if (!sanitizedReportData) {
    return cb(invalidReportDataErrMsg);
  } 
  
  const reportModel = reportsService.buildReportModel(sanitizedReportData);
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
  const { reportId, teamId } = data;
  if (!reportId || !teamId) return cb('missing required data');

  const $inc = { '$inc': { 'reports.$.downloadCount': 1  } }
  Team.update({'_id': teamId, 'reports._id': reportId}, $inc, cb);  
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
  incrementReportDownloadCount
};