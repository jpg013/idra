const express         = require('express')
const Team            = require('../models/teamModel');
const AuthMiddleware  = require('../middleware/auth');
const TeamsController = express.Router();
const TeamService     = require('../services/teamService');

/**
 * Constants
 */
const addTeamErrorMsg = 'There was an error creating the team';
const editTeamErrMsg = 'There was an error updating the team';
const deleteTeamErrorMsg = 'There was an error deleting the team';

const getTeams = (req, res) => {
  TeamService.queryTeams({}, (err, results) => {
    if (err) {
      return res.status(500).send({results :[]});
    }
    return res.status(200).send({results});
  });
}

const createTeam = (req, res) => {
  TeamService.createTeam(req.body, (err, createdTeam) => {
    if (err) {
      return res.json({ success: false, msg: err });
    }
    res.json({success: true, data: createdTeam.clientProps});
  });
}

function getTeamReportSets(req, res) {
  const { teamId } = req.query;
  if (!teamId) {
    return res.status(400).send({err: 'missing required team id'});
  }
  TeamService.findTeam(teamId, (err, teamModel) => {
    if (err || !teamModel)  {
      return res.status(500).send({error: err});
    }
    const setItems = teamModel.reportSets.map(cur => {
      return {
        name: cur.name,
        id: cur.id
      }
    });
    return res.status(200).send({results: setItems});
  })
}

/**
 * Controller Routes
 */
TeamsController.get('/', AuthMiddleware.isAdmin, getTeams);
TeamsController.get('/reportsets', AuthMiddleware.isAdmin, getTeamReportSets);
TeamsController.post('/', AuthMiddleware.isAdmin, createTeam);

module.exports = TeamsController;
