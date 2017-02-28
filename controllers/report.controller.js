const common         = require('../common');
const express        = require('express')
const reportRouter   = express.Router();
const reportModel    = require('../models/report.model');
const reportSetModel = require('../models/report-set.model');

reportRouter.get('/query', function(req, res) {

});

module.exports = reportRouter;
