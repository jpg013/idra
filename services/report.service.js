const Report        = require('../models/report.model');
const ReportGroup   = require('../models/report-group.model');
const ReportRequest = require('../models/report-request.model');
const Team          = require('../models/team.model');
const ReportFactory = require('../factories/report.factory');
const async         = require('async');
const TeamService   = require('./team.service');
const CryptoClient  = require('../common/crypto');
const Idra          = require('./idra');

const invalidDataErrMsg = 'invalid report data';

function createReportLog(data, cb) {
  const scrubbedReportLogData = ReportFactory.scrubReportLogData(data);

  if (!ReportFactory.validateReportLogFields(scrubbedReportLogData)) {
    return cb(invalidDataErrMsg);
  }
  const reportLogModel = ReportFactory.buildReportLogModel(scrubbedReportLogData);
  reportLogModel.save(cb);
}

function flattenReportCollections(collections) {
  if (!collections) return;
  return collections.reduce((acc, cur) => {
    return acc.concat(cur);
  }, []);
}

function getAllReports(cb) {
  Team
    .find({}, {reportCollection: 1})
    .exec(function(err, results) {
      if (err || !results) return cb('Error getting reports');
      results = results.map(cur => {
        const props = cur.clientProps;
        return props.reportCollection;
      })
      return cb(undefined, flattenReportCollections(results));
    });
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
    cb => createReportLog({userId: userModel.id, reportId: reportModel.id}, err => cb(err)),
    cb => TeamService.incrementReportDownloadCount({teamId: userModel.team.id, reportModel}, err => cb(err)),
    cb => TeamService.setLastActivityDate(userModel.team.id, err => cb(err)),
    cb => Idra.runReport(idraArgs, cb)
  ];

  async.waterfall(pipeline, (err, results) => {
    console.log(err);
  });
}

function downloadReportAsAdmin(teamId, reportModel, cb) {
  if (!teamId || !reportModel) return cb('missing required data');

  const pipeline = [
    cb => TeamService.findTeam(teamId),
    (teamModel, cb) => {
      if (!teamModel) {
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
  getAllReports,
  downloadReportAsAdmin,
  downloadReportAsUser
}