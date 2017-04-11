const Report = require('../models/report.model');
const ReportGroup = require('../models/report-group.model');

function buildReportModel(reportData) {
  const {name, description, query, groupName, createdBy, teamId} = reportData;
  return Report({
    name,
    description,
    query,
    groupName,
    createdBy,
    teamId,
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

module.exports = {
  buildReportModel,
  buildReportGroupModel
}