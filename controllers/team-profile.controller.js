const express                   = require('express')
const AuthMiddleware            = require('../middleware/auth');
const TwitterCredentialService  = require('../services/twitter-credential.service');
const TeamService               = require('../services/team.service');
const TwitterIntegrationService = require('../services/twitter-integration.service');
const async                     = require('async');
const Idra                      = require('../services/idra');
const Jino                      = require('../services/jinro/index');

/**
 *  Declare Express Controller
 */
const TeamProfileController = express.Router();

const getTeamDetails = (opts = {}, cb) => {
  TeamService.getProfileDetails(opts.teamId, (err, teamDetails = {}) => {
    if (err) return cb(err);
    if (opts.results) {
      opts.results.teamDetails = teamDetails;
    }
    return cb(err, opts);
  });
}

const getTwitterCredentialDetails = (opts={}, cb) => {
  TwitterCredentialService.getTwitterCredential(opts.teamId, (err, twitterCredential={}) => {
    if (err) return cb(err);
    if (opts.results) {
      opts.results.twitterCredential = twitterCredential;
    }
    return cb(err, opts);
  });
}

const getTwitterIntegrationDetails = (opts = {}, cb) => {
  TwitterIntegrationService.getMostRecentIntegration(opts.teamId, (err, twitterIntegration={}) => {
    if (err) return cb(err);
    if (opts.results) {
      opts.results.twitterIntegration = twitterIntegration.clientProps;
    }
    return cb(err, opts);
  });
}

function getAdminTeamProfile(req, res) {
  const teamId = req.query.teamId;
  if (!teamId) { 
    return res.status(400).send({err: 'Missing required team id'});
  }

  const pipelineOpts = {
    teamId: teamId,
    results: {}
  };

  const init = cb => cb(undefined, pipelineOpts);
  const onDone = (err, acc={}) => {
    const {results} = acc;
    if (err) {
      return res.status(500).send({err: 'Error getting team profile'});
    }
    return res.status(200).send({results});
  }

  const pipeline = [
    init,
    getTeamDetails,
    getTwitterCredentialDetails,
    getTwitterIntegrationDetails
  ];

  async.waterfall(pipeline, onDone);
}

function startTwitterIntegration(req, res) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({err: 'must have admin privileges to start Twitter Integration'});
  }
  const {teamId} = req.body;
  
  
  if (!teamId) {
    return res.status(400).send({err: 'Missing required team id'});
  }
  
  const checkExistingTwitterIntegration = (results, cb) => TwitterIntegrationService.getRunningTwitterIntegration(teamId, (err, twitterIntegration) => {
    if (err) return cb(err);
    return twitterIntegration ? cb('Twitter integration currently in progress for user team.', twitterIntegration.clientProps) : cb(err, results); 
  });
  const getTeam = (results, cb) => TeamService.findTeam(teamId, (err, team) => {
    if (err) return cb(err);
    if (!team) return cb('There was an error finding user team.');
    results.teamModel = team;
    return cb(err, results);
  });
  const getTwitterCredential = (results, cb) => {
    TwitterCredentialService.getTwitterCredential(teamId, (err, twitterCredential) => {
      if (err) return cb(err);
      if (!twitterCredential) return cb('No valid Twitter credentials found for user team.');
      results.twitterCredential = twitterCredential;
      cb(err, results);    
    });
  }
  const getIntegrationUserList = (results, cb) => {
    Idra.getTwitterScreenNames(results.teamModel.neo4jCredentials, function(err, userData = []) {
      if (err) return cb(err);
      results.userList = userData.map(cur => Object.assign({}, cur, { followers: [], friends: [] }));
      return cb(err, results);
    });
  }
  
  const pipeline = [
    cb => cb(undefined, {createdBy: req.user.id}),
    checkExistingTwitterIntegration, 
    getTeam, 
    getTwitterCredential, 
    getIntegrationUserList
  ];
  
  const errorHandler = err => {
    if (err === 'Twitter integration currently in progress for user team.' ||
        err === 'No valid Twitter credentials found for user team.') {
      return res.status(200).send({success: false, msg: err});
    } else {
      return res.status(500).send({success: false, msg: 'There was an error while starting Twitter Integration for user team.'});
    }
  }
  
  async.waterfall(pipeline, function(err, results) {
    if (err) return errorHandler(err);
    
    TwitterIntegrationService.createIntegration(results, function(err, newTwitterIntegration) {
      if (err) {
        return res.status(500).send({success: false, msg: 'There was an error while starting Twitter Integration for user team.'});
      }
      
      /* Kick off a Jinro job to run the pending integration */  
      Jino.runPendingTwitterIntegrations();
      
      return res.status(200).send({data: newTwitterIntegration.clientProps});
    })
  });
}

function updateTwitterCredential(req, res) {
  const { consumer_key, consumer_secret, access_token_key, access_token_secret, teamId } = req.body;

  if (!teamId) return res.status(400).send({err: 'Missing required data'});
  if ((teamId !== req.user.team.toString()) && !user.isAdmin) {
    return res.status(403).send({success: false});
  }
  
  TwitterCredentialService.updateTwitterCredential({ consumer_key, consumer_secret, access_token_key, access_token_secret, teamId }, (err) => {
    if (err) {
      return res.status(500).send({success: true});
    }
    return res.status(200).send({success: true});
  });
}

/**
 * Controller Routes
 */
TeamProfileController.get('/admin', AuthMiddleware.isAdmin, getAdminTeamProfile);
TeamProfileController.post('/twittercredential', AuthMiddleware.populateUser, updateTwitterCredential);
TeamProfileController.post('/twitterintegration', AuthMiddleware.populateUser, startTwitterIntegration);

module.exports = TeamProfileController;
