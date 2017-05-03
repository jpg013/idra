const express               = require('express')
const TeamProfileController = express.Router();
const AuthMiddleware        = require('../middleware/auth');
const Jinro                 = require('../services/jinro');
const TeamService           = require('../services/team.service');

function getAdminTeamProfile(req, res) {
  const teamId = req.query.teamId;
  console.log(teamId);
}

function syncTeamWithTwitter(req, res) {
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

/**
 * Controller Routes
 */
TeamProfileController.get('/admin', getAdminTeamProfile);
TeamProfileController.post('/admin/twittersync', AuthMiddleware.isAdmin, syncTeamWithTwitter);

module.exports = TeamProfileController;
