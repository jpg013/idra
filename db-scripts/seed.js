const TeamFactory      = require('../factories/team.factory');
const TeamService      = require('../services/team.service');
const UserService      = require('../services/user.service');
const UserFactory      = require('../factories/user.factory');
const ReportService    = require('../services/report.service'); 
const ReportFactory    = require('../factories/report.factory');

const ReportCollection = require('../models/report-collection.model');
const Team             = require('../models/team.model');
const User             = require('../models/user.model');
const ReportLog        = require('../models/report-log.model');
const ReportRequest    = require('../models/report-request.model'); 
const async            = require('async');
const SeedData         = require('./seed-data');
const dotenv           = require('dotenv');

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
const removeReportRequests = cb => ReportRequest.collection.drop(() => cb());

/**
 * Load User Teams
 */
function loadUserTeams(cb) {
  async.eachSeries(SeedData.teams, function(data, teamSavedCb) {
    const scrubbedData = TeamFactory.scrubTeamData(data);
    if (!TeamFactory.validateTeamFields(scrubbedData)) {
      throw new Error('invalid team data');  
    };
    const teamModel = TeamFactory.buildTeamModel(scrubbedData);
    teamModel.save(teamSavedCb);
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
        const scrubbedData = UserFactory.scrubUserData(userData);
        if (!UserFactory.validateUserFields(scrubbedData)) {
          throw new Error('invalid use data');
        }
        const userModel = UserFactory.buildUserModel(scrubbedData)
        userModel.save(cb)
      }
    ];
    async.waterfall(pipeline, userSavedCb);
  }, cb);
}

/**
 * Load Report Collections
 */

function loadReportCollections(cb) {
  const findMasterUser = cb => {
    UserService.queryUsers({email: 'jim.morgan@innosolpro.com'}, function(err, userModels) {
      if (!userModels || !userModels.length) return cb('missing required master user');
      return cb(err, userModels[0]);
    });
  }
  async.eachSeries(SeedData.reportCollections, function(data, cb) {
    const pipeline = [
      cb => findMasterUser(cb),
      (userModel, cb) => {
        const scrubbedData = ReportFactory.scrubReportCollectionData(Object.assign({}, data, {createdBy: userModel.id}));
        if (!ReportFactory.validateReportCollectionFields(scrubbedData)) {
          throw new Error('invalid report collection data');
        }
        const reportCollectionModel = ReportFactory.buildReportCollectionModel(scrubbedData);
        reportCollectionModel.save(err => cb(err, userModel, reportCollectionModel))
      },
      (userModel, reportCollectionModel, cb) => {
        const reportList = data.reportList.map(cur => {
          const scrubbedData = ReportFactory.scrubReportData(Object.assign({}, cur, {createdBy: userModel.id}));
          if (!ReportFactory.validateReportFields(scrubbedData)) {
            throw new Error('invalid report data');
          }
          return ReportFactory.buildReportModel(scrubbedData);          
        });

        const $query = {'_id': reportCollectionModel.id};
        const $update = { $push: { 'reportList': { $each : reportList} } };
        ReportCollection.update($query, $update, cb);
      }
    ];
    async.waterfall(pipeline, cb);
  }, cb);
}

const seedPipeline = [
  removeTeams,
  removeUsers,
  removeReportLogs,
  removeReportRequests,
  loadUserTeams,
  loadUsers,
  loadReportCollections
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

