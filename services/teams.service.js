const Team           = require('../models/team.model');
const cryptoClient   = require('../common/crypto');
const reportsService = require('./reports.service');

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
  const {name, createdBy, teamId} = data;
  if (!name || name.trim().length < 3 || !createdBy || !teamId) {
    return false;
  }
  return {name, createdBy, teamId};
}

const getSanitizedReportData = data => {
  const {name, description, query, groupName, createdBy, teamId } = data;
  if (!name || !description || !query || !groupName || !createdBy || !teamId) { return; }
  return {name, description, query, groupName, createdBy, teamId};
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

  doesTeamNameExist(sanitizedTeamData.name, function(err, exists) {
    if (err) return cb(addTeamErrMsg);
    if (exists) return cb(teamExistsErrMsg);
    
    const newTeamModel = buildTeamModel(sanitizedTeamData);
    
    newTeamModel.save(function(err) {
      if (err) return cb(addTeamErrMsg);
      findTeam(newTeamModel.id, function(err, teamModel) {
        return err ? cb(addTeamErrorMsg) : cb(undefined, teamModel);
      });
    });
  });
}

const updateTeam = (teamId, data, cb) => {
  const { name, neo4jAuth, neo4jConnection } = data;
  const $set = { name, neo4jAuth, neo4jConnection };
  Team.findOneAndUpdate({_id: teamId}, {$set}, {new: true}, cb);
}

function createTeamReportGroup(reportGroupData, cb) {
  const sanitizedReportGroupData = getSanitizedReportGroupData(reportGroupData);
  if (!sanitizedReportGroupData) {
    return cb(invalidReportGroupDataErrMsg);
  }
  
  findTeam(sanitizedReportGroupData.teamId, function(err, teamModel) {
    if (err) return cb(err);
    if (!teamModel) return cb(teamDoesNotExistErrMsg);
    const existingGroup = teamModel.reportGroups.find(cur => cur.name === sanitizedReportGroupData.name);
    if (existingGroup) {
      return cb(addReportGroupErrMsg);
    }
    const reportGroupModel = reportsService.buildReportGroupModel(sanitizedReportGroupData);
    const $push = {
      $push: {'reportGroups': reportGroupModel}
    };

    const opts = {
      upsert: true,
      new: true
    };

    Team.findByIdAndUpdate(teamModel.id, $push, opts, function(err, teamModel) {
      return err ? cb(addReportGroupErrMsg) : cb(undefined, teamModel);
    });   
  })
}

function createTeamReport(reportData, cb) {
  const sanitizedReportData = getSanitizedReportData(reportData);
  if (!sanitizedReportData) {
    return cb(invalidReportDataErrMsg);
  } 
  const reportModel = reportsService.buildReportModel(sanitizedReportData);
  findTeam(sanitizedReportData.teamId, function(err, teamModel) {
    if(err) return cb(err);
    if (!teamModel) return cb(teamDoesNotExistErrMsg);

    const reportGroup = teamModel.reportGroups.find(cur => cur.name === reportModel.groupName);
    
    const addReportToTeam = (callback) => {
      const $push = {
        $push: {'reports': reportModel}
      };

      const opts = {
        upsert: true,
        new: true
      };

      Team.findByIdAndUpdate(teamModel.id, $push, opts, function(err, teamModel) {
        return err ? callback(addReportErrMsg) : callback(undefined, teamModel);
      });   
    }
    
    if (!reportGroup) {
      const reportGroupData = {
        name: sanitizedReportData.groupName,
        teamId: teamModel.id,
        createdBy: sanitizedReportData.createdBy
      }
      createTeamReportGroup(reportGroupData, function(err, teamModel) {
        if (err) return cb(addReportErrMsg);
        addReportToTeam(cb);
      })
    } else {
      addReportToTeam(cb);
    }
  });
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

module.exports = {
  canDeleteTeam,
  queryTeams,
  deleteTeam,
  createTeam,
  updateTeam,
  doesTeamNameExist,
  findTeam,
  createTeamReport,
  createTeamReportGroup,
  incrementUserCount,
  incrementReportDownloadCount
};