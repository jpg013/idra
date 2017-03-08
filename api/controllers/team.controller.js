const mongoCommon = require('../../common/mongo');
const Express     = require('express')
const TeamRouter  = Express.Router();
const Team        = require('../../models/team.model');

TeamRouter.get('/', function(req, res) {
  Team.find({}, function(err, teams) {
    const data = teams.map((cur) => {
      const {id, name, createdDate, reportSetCount, reportCount, userCount} = cur;
      return {
        id, 
        name,
        createdDate, 
        reportSetCount, 
        reportCount,
        userCount
      };
    });
    res.json({data});
  });
});

TeamRouter.post('/', function (req, res) {
  const teamModel = new Team({
    name: 'Innosol Test Team',
    id: mongoCommon.generateObjectId(),
    userCount: 0
  });

  teamModel.save(function(err) {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = TeamRouter;
