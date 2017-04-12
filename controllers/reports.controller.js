const express        = require('express')
const reportsService = require('../services/reports.service');
const teamsService   = require('../services/teams.service');
const usersService   = require('../services/users.service');
const idra           = require('../services/idra');
const json2csv       = require('json2csv');
const async          = require('async');

const reportsController = express.Router();

const downloadReportErrMsg = 'An error occurred while downloading the report';
const downloadReportBadRequestMsg = 'Missing required report id or team id';

const convertToCsv = (data) => {
  const fields = Object.keys(data[0]);
  return json2csv({ data, fields });
}

const downloadReport = (req, res) => {
  const { reportId, teamId } = req.body;
  if (!reportId || !teamId) return res.status(400).send({sucess: false, msg: downloadReportBadRequestMsg});

  usersService.findUser(req.authTokenData.id, function(err, userModel) {
    if (err || !userModel) return res.json({success: false, msg: downloadReportErrMsg});
    
    const report = userModel.team.reports.find(cur => cur.id === reportId);
    if (!report) return res.status(400).send({sucess: false, msg: downloadReportBadRequestMsg});
    
    const idraCreds = {
      connection: userModel.team.neo4jConnection,
      auth: userModel.team.neo4jAuth
    };

    const pipeline = [
      cb => reportsService.createReportLog({userId: userModel.id, reportId}, cb),
      cb => teamsService.incrementReportDownloadCount({teamId, reportId}, cb),
      (teamModel, cb) => idra.queryNeo4j(report.query, idraCreds, cb)
    ];

    async.waterfall(pipeline, function(err, reportData) {
      if (err || !reportData) {
        return res.json({success: false, msg: downloadReportErrMsg});
      }
      const reportCsv = convertToCsv(reportData);
      res.status(200).send({success: true, data: reportCsv});
    })
  });
}

/**
 * Reports Controller Routes
 */

reportsController.post('/download', downloadReport);

module.exports = reportsController;
