const Report           = require('../models/report.model');
const ReportSet        = require('../models/report-set.model');
const ReportRequest    = require('../models/report-request.model');
const ReportFactory    = require('../factories/report.factory');
const async            = require('async');
const TeamService      = require('./team.service');
const CryptoClient     = require('../common/crypto');
const Idra             = require('./idra');

const invalidDataErrMsg = 'invalid report data';

function createReportLog(data, cb) {
  const scrubbedReportLogData = ReportFactory.scrubReportLogData(data);

  if (!ReportFactory.validateReportLogFields(scrubbedReportLogData)) {
    return cb(invalidDataErrMsg);
  }
  const reportLogModel = ReportFactory.buildReportLogModel(scrubbedReportLogData);
  reportLogModel.save(cb);
}

function createReportRequest(data, cb) {
  const scrubbedReportRequestData = ReportFactory.scrubReportRequestData(data);
  if (!ReportFactory.validateReportRequestFields(scrubbedReportRequestData)) {
    return cb(invalidDataErrMsg);
  }
  const reportRequestModel = ReportFactory.buildReportRequestModel(scrubbedReportRequestData);
  reportRequestModel.save(err => cb(err));
}

function downloadReportAsUser(userModel, reportModel, cb) {
  if (!userModel || !reportModel) return cb('missing required data');

  const idraArgs = {
    connection: CryptoClient.decrypt(userModel.team.neo4jCredentials.connection),
    auth: CryptoClient.decrypt(userModel.team.neo4jCredentials.auth),
    query: reportModel.query
  };
  
  const pipeline = [
    cb => createReportLog({userId: userModel.id, reportId: reportModel.id}, err => cb()),
    cb => TeamService.incrementReportDownloadCount(reportModel, err => cb()),
    cb => TeamService.setLastActivityDate(userModel.team.id, err => cb()),
    cb => Idra.runReport(idraArgs, cb)
  ];

  async.waterfall(pipeline, (err, results) => {
    cb(err, results);
  });
}

function downloadReportAsAdmin(reportId, teamId, cb) {
  if (!reportId || !teamId) return cb('missing required report id');

  const pipeline = [
    cb => TeamService.findTeam(teamId, cb),
    (teamModel, cb) => {
      if (!teamModel) {
        return cb('missing required data');
      }
      const reportModel = teamModel.findReport(reportId);
      console.log(reportModel);
      if (!reportModel) {
        return cb('missing required data');
      }
      const idraArgs = {
        connection: CryptoClient.decrypt(teamModel.neo4jCredentials.connection),
        auth: CryptoClient.decrypt(teamModel.neo4jCredentials.auth),
        query: reportModel.query
      }
      Idra.runReport(idraArgs, cb);
    }
  ];
  async.waterfall(pipeline, cb);
}

module.exports = {
  createReportLog,
  createReportRequest,
  downloadReportAsAdmin,
  downloadReportAsUser
}