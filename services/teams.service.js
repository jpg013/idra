const Team = require('../models/team.model');

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

const doesTeamNameExists = (name, cb) => {
  queryTeams({name}, (teams) => cb(teams.length > 0))
}

const queryTeams = (query, cb) => {
  Team.find(query).exec(function(err, teams) {
    return cb(err, data)
  });
}

const findTeam = (id, cb) => {
  Team.find({_id: id}, function(err, teamModel) {
    return cb(err, teamModel);
  });
}

const deleteTeam = (id, cb) => {
  Team.findByIdAndRemove(id, cb);
}

const createTeam = (data, cb) => {
  const teamData = Object.assign({}, data, {
    reportCollections: [],
    createdDate: new Date(),
    userCount: 0
  });
  
  const team = new Team(teamData);

  team.save(function(err) {
    if (err) return cb(err);
    findTeam(team.id, cb);
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
  updateTeam
};