const mongoCommon = require('../../common/mongo');
const Express     = require('express')
const TeamRouter  = Express.Router();
const Team        = require('../../models/team.model');

TeamRouter.get('/', function(req, res) {
  Team.find({}, function(err, teams) {
    res.json({teams});
  });
});

TeamRouter.post('/', function (req, res) {
  const teamModel = new Team({
    name: 'Innosol Test Team',
    id: mongoCommon.generateObjectId()
  });

  teamModel.save(function(err) {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = TeamRouter;
