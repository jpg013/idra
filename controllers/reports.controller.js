const express           = require('express')
const reportsService    = require('../services/reports.service');
const usersService      = require('../services/users.service');
const idra              = require('../services/idra');
const reportsController = express.Router();

const downloadReportErrMsg = 'An error occurred while downloading the report';
const downloadReportBadRequestMsg = 'Missing required report id or collection id';

const downloadReport = (req, res) => {
  const { reportId, reportCollectionId } = req.body;
  if (!reportId || !reportCollectionId) return res.status(400).send({sucess: false, msg: downloadReportBadRequestMsg});
  
  usersService.findUser(req.authTokenData.id, function(err, userModel) {
    if (err || !userModel) return res.json({success: false, msg: downloadReportErrMsg});
    const report = reportsService.lookupReport(userModel.team, reportCollectionId, reportId);
    if (!report) {
      res.json({success: false, msg: downloadReportErrMsg});
    }
    
    idra.runReport(userModel.team, report, function(err, reportCsv) {
      if (err || !reportCsv) {
        return res.json({success: false, msg: downloadReportErrMsg});
      }
      res.status(200).send({success: true, data: reportCsv});
    });
  });
}

/**
 * Reports Controller Routes
 */

reportsController.post('/download', downloadReport);

module.exports = reportsController;
