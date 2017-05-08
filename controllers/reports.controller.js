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

const downloadUserReport = (req, res) => {
  const { reportId } = req.body;
  if (!reportId) return res.status(400).send({sucess: false, msg: downloadReportBadRequestMsg});

  const onReportDownloadDone = (err, results) => {
    if (err || !results) {
      return res.json({success: false, msg: downloadReportErrMsg});
    }
    res.status(200).send({success: true, results})
  }

  UserService.findUser(req.authTokenData.id, (err, userModel) => {
    if (err || !userModel) {
      return res.json({success: false, msg: downloadReportErrMsg});
    }

    const reportModel = userModel.team.findReport(reportId);

    if (!reportModel) {
      return res.json({success: false, msg: downloadReportErrMsg});
    }
    return ReportService.downloadReportAsUser(userModel, reportModel, onReportDownloadDone);
  })
}

const downloadAdminReport = (req, res) => {
  const { reportId, teamId } = req.body;
  if (!reportId || !teamId) return res.status(400).send({sucess: false, msg: downloadReportBadRequestMsg});
  
  const onReportDownloadDone = (err, results) => {
    if (err || !results) {
      return res.json({success: false, msg: downloadReportErrMsg});
    }
    res.status(200).send({success: true, results})
  }

  /* download report as admin */
  ReportService.downloadReportAsAdmin(reportId, teamId, onReportDownloadDone);
}

function getReportList(req, res) {
  TeamService.getReportList((err, results) => {
    if (err) {
      return res.status(500).send({msg: 'There was an error getting the reports'});
    }
    return res.status(200).send({results});
  });
}

function requestReport(req, res) {
  const {reportSetId, userId, request} = req.body;
  if (!reportSetId || !userId || !request) return;
  const data = {
    userId,
    reportSetId,
    request
  }
  ReportService.createReportRequest(data, () => res.status(200).send({success: true}));
}

/**
 * Reports Controller Routes
 */
reportsController.post('/download', downloadUserReport);
reportsController.post('/admindownload/', AuthMiddleware.isAdmin, downloadAdminReport);
reportsController.post('/request', requestReport);
reportsController.get('/list', AuthMiddleware.isAdmin, getReportList);

module.exports = reportsController;
