const express           = require('express')
const reportsService    = require('../services/reports.service');
const usersService      = require('../services/users.service');
const reportsController = express.Router();

const downloadReportErrMsg = 'An error occurred while downloading the report';

const downloadReport = (req, res) => {
  const { reportId, reportCollectionId } = req.body;
  if (!reportId || !reportCollectionId) return res.sendStatus(400);
  
}

reportsController.post('/download', function(req, res) {
  const {collectionId, reportId} = req.body;
  if (!collectionId || !reportId) {
    return res.sendStatus(400);
  }
  
  usersService.findUser(req.authTokenData._id, function(err, userModel) {
    if (err) return res.json({success: false, msg: downloadReportErrMsg});
    if (!userModel) {
      return res.json({success: false, msg: downloadReportErrMsg});
    }
    const report = reportsService.lookupTeamReport(userModel.team, collectionId, reportId);
    if (!report) {
      res.json({success: false, msg: downloadReportErrMsg});
    }
    //TODO - Talk to Idra here
    setTimeout(function() {
      return res.json({success: true});
    }, 2500);
  });
});

/**
 * Reports Controller Routes
 */

reportsController.post('/download', downloadReport);

module.exports = reportsController;
