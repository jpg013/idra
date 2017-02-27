const common         = require('../common');
const express        = require('express')
const reportRouter   = express.Router();
const reportModel    = require('../models/report.model');
const reportSetModel = require('../models/report-set.model');

TeamRouter.get('/', function(req, res) {
  Team.find({}, function(err, teams) {
    res.json({teams});
  });
});

TeamRouter.post('/', function (req, res) {
  const teamModel = new Team({
    name: 'Innosol Test Team',
    id: Common.generateObjectId()
  });

  teamModel.save(function(err) {
    if (err) throw err;
    console.log('team saved successfully');
    res.json({ success: true });
  });
});

module.exports = TeamRouter;
