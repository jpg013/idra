const mongoCommon = require('../../common/mongo');
const Express     = require('express')
const TeamRouter  = Express.Router();
const Team        = require('../../models/team.model');

TeamRouter.get('/', function(req, res) {
  Team.find({}, function(err, teams) {
    const data = teams.map( cur=> cur.clientProps);
    res.json({data});
  });
});

TeamRouter.delete('/', function(req, res) {
  const {id} = req.body;
  if (!id) {
    return res.send(400);
  }
  Team.findOne({_id: id}, function(err, teamModel) {
    if (err) { return; }
    if (!teamModel) {
      return res.json({success: false});
    }
    if (teamModel.userCount > 0) {
      return res.json({success: false, msg: "Cannot delete team with existing users"});
    }
    teamModel.remove(function(err) {
      if (err) {
        throw err;
      }
      return res.send({success: true})
    })
  });
});

TeamRouter.post('/', function (req, res) {
  const {name, neo4jConnection, neo4jAuth} = req.body;
  if (!name.trim() || !neo4jConnection.trim() || !neo4jAuth.trim()) {
    return res.json({success: false, msg: 'Could not create team due to missing fields.'});
  }
  
  const teamModel = new Team({
    name,
    neo4jAuth,
    neo4jConnection,
    reportSets  : [],
    createdDate : new Date(),
    userCount: 0
  });

  teamModel.save(function(err) {
    if (err) {  
      return res.json({ success: false, msg: 'Could not create team due to an error while saving.' });
    }
    Team.findOne({_id: teamModel._id}, function(err, team) {
      if (err) {
        return res.json({ success: false, msg: 'Could not create team due to an error while saving.' });  
      }
      return res.json({success: true, data: team.clientProps})
    })
  });
});

TeamRouter.put('/', function(req, res) {
  const {name, neo4jConnection, neo4jAuth, id} = req.body;
  if (!name.trim() || !neo4jConnection.trim() || !neo4jAuth.trim()) {
    return res.json({success: false, msg: 'Could not edit team due to missing fields.'});
  }
  
  Team.findOne({_id: id}, function(err, teamModel) {
    if (err) throw err;
    if (!teamModel) {
      return res.json({success: false, msg: 'There was an error updating the team'});
    }
    
    const $set = {
      name,
      neo4jAuth,
      neo4jConnection
    };
    
    Team.findOneAndUpdate({_id: teamModel._id}, {$set}, {new: true}, function(err, teamModel) {
      if (err) throw err;
      res.json({success: true, data: teamModel.clientProps});
    })
  });
})

module.exports = TeamRouter;
