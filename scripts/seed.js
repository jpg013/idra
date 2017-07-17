const TeamFactory              = require('../factories/teamFactory');
const TeamService              = require('../services/teamService');
const UserService              = require('../services/userService');
const Team                     = require('../models/teamModel');
const User                     = require('../models/userModel');
const Integration              = require('../models/integrationModel');
const ReportRequest            = require('../models/reportRequestModel');
const async                    = require('async');
const SeedData                 = require('./seedData');
const dotenv                   = require('dotenv');

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

const dropTeams = cb => Team.collection.drop(() => cb());
const dropUsers = cb => User.collection.drop(() => cb());
const dropIntegrations = cb => Integration.collection.drop(() => cb());
const dropReportRequests = cb => ReportRequest.collection.drop(() => cb());

/**
 * Load User Teams
 */

function loadUserTeams(cb) {
  async.eachSeries(SeedData.teams, function(data, eachCb) {
    TeamService.createTeam(data, eachCb);
  }, cb);
}

function loadUsers(cb) {
  async.eachSeries(SeedData.users, function(data, userSavedCb) {
    const pipeline = [
      cb => TeamService.queryTeams({name: data.teamName}, (err, teamModels) => {
       if (!teamModels || !teamModels.length) {
         return cb('missing team model');
       }
       return cb(err, teamModels[0]);
      }),
      (teamModel, cb) => {
        const userData = Object.assign({}, data, {team: teamModel.id});
        UserService.createUser(userData, cb);
      }
    ];
    async.waterfall(pipeline, userSavedCb);
  }, cb);
}

/**
 * Load Reports
 */

function loadTeamReports(cb) {
  async.eachSeries(SeedData.teams, function(data, cb) {
    const findMasterUser = cb => {
      UserService.queryUsers({email: 'jim.morgan@innosolpro.com'}, function(err, userModels) {
        if (!userModels || !userModels.length) {
          return cb('missing required master user');
        }
        return cb(err, userModels[0]);
      });
    }

    const findMasterTeam = (userModel, cb) => {
      TeamService.queryTeams({name: data.name}, (err, results = []) => {
        if (err) {
          return cb(err);  
        }
        if (!results.length) {
          return cb('missing required team');  
        }
        return cb(err, userModel, results[0]);
      })
    }

    const buildReports = (userModel, teamModel, cb) => {
      async.eachSeries(data.reports, (data, eachCb) => {
        const reportData = Object.assign({}, data, {
          user: userModel,
          teamId: teamModel.id
        });
        TeamService.createReport(reportData, eachCb);
      }, cb);
    }

    const pipeline = [
      findMasterUser,
      findMasterTeam,
      buildReports
    ];

    async.waterfall(pipeline, cb);
  }, cb);
}

const seedPipeline = [
  dropTeams,
  dropUsers,
  dropIntegrations,
  dropReportRequests,
  loadUserTeams,
  loadUsers,
  loadTeamReports
];

async.series(seedPipeline, function(err) {
  if (err) {
    console.error('there was an error running the script! ', err);
    process.exit();
  } else {
    console.log('success!');
    process.exit();
  }
});
