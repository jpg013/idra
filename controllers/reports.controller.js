const express        = require('express')
const ReportService  = require('../services/report.service');
const TeamService    = require('../services/team.service');
const UserService    = require('../services/user.service');
const idra           = require('../services/idra');
const async          = require('async');
const AuthMiddleware = require('../middleware/auth');

const reportsController = express.Router();

const downloadReportErrMsg = 'An error occurred while downloading the report';
const downloadReportBadRequestMsg = 'Missing required report id or team id';

const convertToCsv = (data) => {
  const fields = Object.keys(data[0]);
  return json2csv({ data, fields });
}

const downloadReport = (req, res) => {
  const { reportId, reportCollectionId } = req.body;
  if (!reportId || !reportCollectionId) return res.status(400).send({sucess: false, msg: downloadReportBadRequestMsg});
  
  UserService.findUser(req.authTokenData.id, (err, userModel) => {
    if (err || !userModel) {
      return res.json({success: false, msg: downloadReportErrMsg});
    }

    const onReportDownloadDone = (err, results) => {
      if (err || !results) {
        return res.json({success: false, msg: downloadReportErrMsg});
      }
      res.status(200).send({success: true, results})
    }

    const reportModel = userModel.team.findReport(reportCollectionId, reportId);
    
    /* User has access to report */
    if (reportModel) {
      return ReportService.downloadReportAsUser(userModel, reportModel, onReportDownloadDone)
    }
    
    /* User is unauthorized to download report */
    if (!userModel.isAdmin) {
      return res.status(403).send({success: false, msg: downloadReportErrMsg});
    }

    /* download report as admin */
    ReportService.downloadReportAsAdmin(reportId, reportCollectionId, onReportDownloadDone);
  });
}

function getReports(req, res) {
  ReportService.getAllReports((err, results) => {
    if (err) {
      return res.status(500).send({msg: 'There was an error getting the reports'});
    }
    return res.status(200).send({results});
  });
}

function requestReport(req, res) {
  const { groupId, userId,  report} = req.body;
  if (!groupId || !userId || !report) return;
  ReportService.requestReport(report, userId, groupId, () => res.status(200).send({success: true}));
}

/**
 * Reports Controller Routes
 */
reportsController.post('/download', downloadReport);
reportsController.post('/request', requestReport);
reportsController.get('/', AuthMiddleware.isAdmin, getReports);

module.exports = reportsController;
