const express         = require('express')
const Team            = require('../models/team.model');
const AuthMiddleware  = require('../middleware/auth');
const TeamsController = express.Router();
const TeamService     = require('../services/team.service');

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


/**
 * Controller Routes
 */
TeamsController.get('/', AuthMiddleware.isAdmin, getTeams);
//teamsController.delete('/', authMiddleware.isAdmin, deleteTeam);
TeamsController.post('/', AuthMiddleware.isAdmin, createTeam);
//teamsController.put('/', authMiddleware.isAdmin, editTeam);

module.exports = TeamsController;
