const express                  = require('express')
const TeamProfileController    = express.Router();
const AuthMiddleware           = require('../middleware/auth');
const Jinro                    = require('../services/jinro');
const TwitterCredentialService = require('../services/twitter-credential.service');
const TeamService              = require('../services/team.service');

function getAdminTeamProfile(req, res) {
  const teamId = req.query.teamId;
  if (!teamId) { 
    return res.status(400).send({err: 'Missing required team id'});
  }
  TeamService.getAdminProfile(teamId, function(err, results) {
    if (err || !results) {
      return res.status(500).send({err: 'Error getting admin team profile'});
    }
    return res.status(200).send({results});
  });
}

function integrateTeamWithTwitter(req, res) {
  const {teamId} = req.body;
  
  if (!teamId) {
    return res.status(400).send({err: 'Missing required team id'});
  }

  TeamService.findTeam(teamId, function(err, teamModel) {
    if (err || !teamModel) {
      return res.status(500).send({err: 'Error running twitter integration'});
    }
    Jinro.createTwitterIntegrationJob(teamModel, function(err, results) {
      if (err) {
        return res.status(500).send({err});
      }
      return res.status(200).send({results});
    });  
  })
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
TeamProfileController.post('/twitterintegration', AuthMiddleware.populateUser, integrateTeamWithTwitter);

module.exports = TeamProfileController;
