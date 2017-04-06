const Team                  = require('../models/team.model');
const User                  = require('../models/user.model');
const cryptoClient          = require('../common/crypto');
const async                 = require('async');
const teamsService          = require('../services/teams.service');
const usersService          = require('../services/users.service');
const seedData              = require('./data');
const dotenv                = require('dotenv');

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

/**
 * Create Teams
 */

function loadTeam(seed, cb) {
  teamsService.createTeam(seed.team, function(err, teamModel) {
    return cb(err, seed, teamModel);
  });
}

function loadReports(seed, teamModel, cb) {
  if (!seed || !teamModel) {
   return cb('missing required data'); 
  }
  
  async.each(seed.reports, function(reportData, reportCb) {
    const args = Object.assign({}, reportData, {teamId: teamModel.id});
    teamsService.createTeamReport(args, reportCb);
  }, function(err) {
    if (err) return cb(err);
    teamsService.findTeam(teamModel.id, (err, updatedTeamModel) => cb(err, seed, updatedTeamModel));
  });
}

function loadUsers(seed, teamModel, cb) {
  if (!seed || !teamModel) {
   return cb('missing required data'); 
  }

  async.each(seed.users, function(userData, userCb) {
    userData = Object.assign(userData, {team: teamModel.id});
    usersService.createUser(userData, userCb);
  }, cb); 
}

function loadSeedData(cb) {
  async.each(seedData, function(seed, seedLoadedCb) {
    const waterfallInit = cb => cb(undefined, seed);
    async.waterfall([
      waterfallInit, 
      loadTeam, 
      loadReports,
      loadUsers
    ], seedLoadedCb);
  }, cb);
}

async.series([removeTeams, removeUsers, loadSeedData], function(err) {
  if (err) {
    console.log('there was an error running the script! ', err);
    process.exit();
  } else {
    console.log('success!');
    process.exit();
  }
});

