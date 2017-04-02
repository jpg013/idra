const Team = require('../models/team.model');

/**
 * Constants
 */
const addTeamErrorMsg = 'There was an error creating the team';
const teamExistsErrorMsg = 'Team name already exists.'

const canDeleteTeam = teamModel => {
  return teamModel.userCount === 0;
}

const validateTeamForm = (data) => {
  const {name, neo4jConnection, neo4jAuth} = data;

  if (!name || name.trim().length < 3) {
    return false;
  }

  if (!neo4jConnection || !neo4jAuth) {
    return false
  }

  return true;
}

const doesTeamNameExist = (name, cb) => {
  queryTeams({name}, (err, teams) => {
    return cb(err, teams.length > 0);
  });
}

const queryTeams = (query, cb) => {
  Team.find(query).exec(function(err, teamCollection) {
    return cb(err, teamCollection);
  });
}

const findTeam = (id, cb) => {
  Team.findOne({_id: id}, function(err, teamModel) {
    return cb(err, teamModel);
  });
}

const deleteTeam = (id, cb) => {
  Team.findByIdAndRemove(id, cb);
}

const createTeam = (data, cb) => {
  doesTeamNameExist(data.name, function(err, exists) {
    if (err) return cb(addTeamErrorMsg);
    if (exists) return cb(teamExistsErrorMsg);
    
    const teamData = Object.assign({}, data, {
      reportCollections: [],
      createdDate: new Date(),
      userCount: 0
    });  
    const newTeamModel = new Team(teamData);
    newTeamModel.save(function(err) {
      if (err) return cb(addTeamErrorMsg);
      findTeam(teamModel.id, function(err, teamModel) {
        return err ? cb(addTeamErrorMsg) : cb(undefined, teamModel);
      })
    });
  });
}

const updateTeam = (teamId, data, cb) => {
  const { name, neo4jAuth, neo4jConnection } = data;
  const $set = { name, neo4jAuth, neo4jConnection };
  Team.findOneAndUpdate({_id: teamId}, {$set}, {new: true}, cb);
}

module.exports = {
  canDeleteTeam,
  validateTeamForm,
  queryTeams,
  deleteTeam,
  createTeam,
  updateTeam,
  doesTeamNameExist
};