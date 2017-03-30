const express         = require('express')
const Team            = require('../models/team.model');
const authMiddleware  = require('../middleware/auth');
const teamsController = express.Router();
const teamsService    = require('../services/teams.service');
const sockEvents      = require('../socket/sock-events');

/**
 * Constants
 */
const addTeamErrorMsg = 'There was an error creating the team';
const editTeamErrMsg = 'There was an error updating the team';
const deleteTeamErrorMsg = 'There was an error deleting the team';

const getTeams = (req, res) => {
  teamsService.queryTeams({}, (err, teamCollection) => {
    if (err) throw err;
    const data = teamCollection.map(cur => cur.clientProps);
    res.json({data}); 
  })
}

const deleteTeam = (req, res) => {
  const {id} = req.body;
  if (!id) {
    return res.status(400).send({msg: deleteTeamErrorMsg});
  }

  teamsService.findTeam(id, (err, teamModel) => {
    if (err) throw err;

    if (!teamModel) {
      return res.status(400).send({msg: deleteTeamErrorMsg});
    }

    if (!teamsService.canDeleteTeam(teamModel)) {
      return res.json({success: false, msg: 'Cannot delete team with active users'});
    }

    teamsService.deleteTeam(teamModel.id, (err, removedTeam) => {
      if (err) throw err;
      if (!removedTeam) {
        return res.json({success: false});
      }
      return res.json({success: true, removedId: removedTeam.id});
    })     
  });
}

const addTeam = (req, res) => {
  const {name, neo4jConnection, neo4jAuth, imageURL} = req.body;
  const formData = {name, neo4jConnection, neo4jAuth};

  if (!teamsService.validateTeamForm(formData)) {
    return res.status(401).send({success: false, msg: 'Invalid team data'});
  }

  teamsService.createTeam(formData, (err, createdTeam) => {
    if (err) {
      return res.json({ success: false, msg: addTeamErrorMsg }); 
    }

    if (!createdTeam) {
      res.json({success: false, msg: addTeamErrorMsg});
    }

    const socketData = {
      room: 'admin',
      action: 'SOCKET_ADD_TEAM',
      data: createdTeam
    }

    sockEvents.emit(sockEvents.e.notifyRoom, socketData);
    res.json({success: true, data: createdTeam.clientProps});
  });
}

const editTeam = (req, res) => {
  const {name, neo4jConnection, neo4jAuth, id} = req.body;
  const formData = {name, neo4jConnection, neo4jAuth, id};

  if (!teamsService.validateTeamForm(formData)) {
    return res.json({success: false, msg: 'Invalid form data'});
  }

  teamsService.updateTeam(id, formData, (err, updatedTeam) => {
    if (err) throw err;
    if (!updatedTeam) {
      return res.json({success: false, msg: editTeamErrMsg});
    }
    res.json({success: true, data: updatedTeam.clientProps})
  });
  
  team.findOne({_id: id}, function(err, teamModel) {
    if (err) throw err;
    if (!teamModel) {
      return res.json({success: false, msg: editTeamErrMsg});
    }

    const $set = { name, neo4jAuth, neo4jConnection };

    team.findOneAndUpdate({_id: id}, {$set}, {new: true}, function(err, teamModel) {
      if (err) throw err;
      res.json({success: true, data: teamModel.clientProps});
    })
  })
}

/**
 * Controller Routes
 */
teamsController.get('/', authMiddleware.isAdmin, getTeams);
teamsController.delete('/', authMiddleware.isAdmin, deleteTeam);
teamsController.post('/', authMiddleware.isAdmin, addTeam);
teamsController.put('/', authMiddleware.isAdmin, editTeam);

module.exports = teamsController;
