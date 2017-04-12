const Report = require('../models/report.model');
const ReportGroup = require('../models/report-group.model');
const ReportLog = require('../models/report-log.model');

function buildReportModel(reportData) {
  const {name, description, query, groupName, createdBy, teamId} = reportData;
  return Report({
    name,
    description,
    query,
    groupName,
    createdBy,
    teamId,
    downloadCount: 0,
    createdDate: new Date()
  })
}

function buildReportGroupModel(reportGroupData) {
  const {name, createdBy, teamId} = reportGroupData;
  return ReportGroup({
    name,
    createdBy,
    teamId,
    createdDate: new Date()
  });
}

function createReportLog(data, cb) {
  const { userId, reportId } = data;
  if (!userId || !reportId) return cb('missing required data');
  
  const reportLogModel = ReportLog({
    date: new Date(),
    userId,
    reportId
  });
  reportLogModel.save(err => cb(err));
}

module.exports = {
  buildReportModel,
  buildReportGroupModel,
  createReportLog
}