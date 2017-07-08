const Report           = require('../models/reportModel');
const ReportRequest    = require('../models/reportRequestModel');
const ReportFactory    = require('../factories/reportFactory');
const async            = require('async');
const TeamService      = require('./teamService');
const Idra             = require('./idra');

const invalidDataErrMsg = 'Invalid report data';

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
    connection: userModel.team.neo4jCredentials.connection,
    auth: userModel.team.neo4jCredentials.auth,
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
      if (!reportModel) {
        return cb('missing required data');
      }
      const idraArgs = {
        connection: teamModel.neo4jCredentials.connection,
        auth: teamModel.neo4jCredentials.auth,
        query: reportModel.query
      }
      Idra.runReport(idraArgs, cb);
    }
  ];
  async.waterfall(pipeline, cb);
}

function testQuery(query, teamId, cb) {
  if (!query || !teamId) return cb('missing required data');

  const pipeline = [
    cb => TeamService.findTeam(teamId, cb),
    (teamModel, cb) => {
      if (!teamModel) {
        return cb('missing required data');
      }
      const idraParams = {
        connection: teamModel.neo4jCredentials.connection,
        auth: teamModel.neo4jCredentials.auth,
        query: query
      }
      Idra.runReport(idraParams, cb);
    }
  ];
  async.waterfall(pipeline, cb);
}

module.exports = {
  createReportLog,
  createReportRequest,
  downloadReportAsAdmin,
  downloadReportAsUser,
  testQuery
}
