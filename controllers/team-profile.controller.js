const express                   = require('express')
const TeamProfileController     = express.Router();
const AuthMiddleware            = require('../middleware/auth');
const TwitterCredentialService  = require('../services/twitter-credential.service');
const TeamService               = require('../services/team.service');
const TwitterIntegrationService = require('../services/twitter-integration.service');
const async                     = require('async');

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
  TwitterIntegrationService.getLastIntegrationJob(opts.teamId, (err, twitterIntegration={}) => {
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
  const {teamId} = req.body;
  
  if (!teamId) {
    return res.status(400).send({err: 'Missing required team id'});
  }
  
  const checkExistingTwitterIntegrationJob = cb => TwitterIntegrationService.getRunningTwitterIntegrationJob(teamId, (err, twitterIntegrationJob) => {
    if (err) return cb(err);
    if (twitterIntegrationJob) return cb('Twitter integration currently in progress for user team', twitterIntegrationJob.clientProps); 
    return cb(err);
  });
  const getTeam = cb => TeamService.findTeam(teamId, cb);
  const getTwitterCredential = (teamModel, cb) => TwitterCredentialService.getTwitterCredential(teamId, (err, twitterCred) => cb(err, teamModel, twitterCred));
  
  const pipeline = [checkExistingTwitterIntegrationJob, getTeam, getTwitterCredential];
  
  async.waterfall(pipeline, function(err, teamModel, twitterCred) {
    if (err) {
      return res.status(500).send({success: false, msg: err});
    }
    if (!twitterCred) {
      return res.status(500).send({success: false, msg: 'invalid twitter credentials'});
    }
    TwitterIntegrationService.createIntegrationJob(teamModel, function(err, results) {
      if (err) {
        return res.status(500).send({success: false, msg: err});
      }
      return res.status(200).send({results});
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
    console.log(err);
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
