const Team         = require('../models/team.model');
const User         = require('../models/user.model');
const ReportLog    = require('../models/report-log.model');
const cryptoClient = require('../common/crypto');
const async        = require('async');
const teamsService = require('../services/teams.service');
const usersService = require('../services/users.service');
const seedData     = require('./seed-data');
const dotenv       = require('dotenv');

/**
 * Load in config file  
 */

dotenv.config();

/**
 * Init the mongo connection
 */

require('../config/mongo').config();

/**
 * remove users and teams
 */

const removeTeams = cb => Team.collection.drop(() => cb());
const removeUsers = cb => User.collection.drop(() => cb());
const removeReportLogs = cb => ReportLog.collection.drop(() => cb());

/**
 * Create Teams
 */

function loadTeam(seed, cb) {
  teamsService.createTeam(seed.team, function(err, teamModel) {
    return cb(err, seed, teamModel);
  });
}

function loadReportCollection(seedData, teamModel, userModel, cb) {
  if (!seedData || !teamModel ||! userModel) {
   return cb('missing required data'); 
  }
  
  async.eachSeries(seedData.reportCollection, function(data, callback) {
    /**
     * Build the report Groups
     */
    const groupArgs = Object.assign({}, data, {
      teamId: teamModel.id, 
      teamName: teamModel.name,
      createdBy: `${userModel.firstName} ${userModel.lastName}`, 
      createdById: userModel.id
    });

    async.waterfall([
      cb => teamsService.createReportGroup(groupArgs, cb),
      (reportGroupModel, cb) => {
        async.eachSeries(data.reports, function(data, callback) {
          const reportArgs = Object.assign({}, data, {
            createdBy: `${userModel.firstName} ${userModel.lastName}`, 
            createdById: userModel.id,
            groupId: reportGroupModel.id,
            teamId: teamModel.id,
            teamName: teamModel.name
          });
          teamsService.createReport(reportArgs, callback)
        }, cb)
      }
    ], callback);
  }, cb);
}

function loadUsers(seedData, teamModel, cb) {
  if (!seedData || !teamModel) {
   return cb('missing required data'); 
  }

  const findMasterUser = () => {
    usersService.queryUsers({email: 'jim.morgan@innosolpro.com'}, function(err, userModels) {
      return (userModels && userModels.length ) ? cb(err, seedData, teamModel, userModels[0]) : cb('missing required master user');
    });
  }

  async.eachSeries(seedData.users, function(userData, userCb) {
    userData = Object.assign(userData, {team: teamModel.id});
    usersService.createUser(userData, userCb);
  }, function(err) {
    if (err) return cb(err);
    findMasterUser();
  }); 
}

function loadSeedData(cb) {
  async.eachSeries(seedData, function(seed, seriesCb) {
    async.waterfall([
      cb => cb(undefined, seed),
      loadTeam, 
      loadUsers,
      loadReportCollection
    ], seriesCb);
  }, cb);
}

const seedPipeline = [
  removeTeams,
  removeUsers,
  removeReportLogs,
  loadSeedData
];

async.series(seedPipeline, function(err) {
  if (err) {
    console.log('there was an error running the script! ', err);
    process.exit();
  } else {
    console.log('success!');
    process.exit();
  }
});

