const Report = require('../models/report.model');
const ReportGroup = require('../models/report-group.model');
const ReportLog = require('../models/report-log.model');
const Team = require('../models/team.model');

function buildReportModel(reportData) {
  const {name, description, query, groupId, createdBy, createdById, teamId, teamName} = reportData;
  return Report({
    name,
    description,
    query,
    groupId,
    createdBy,
    teamId,
    createdById,
    teamName,
    downloadCount: 0,
    createdDate: new Date()
  })
}

function buildReportGroupModel(reportGroupData) {
  const {name, createdBy, createdById, teamId, teamName} = reportGroupData;
  return ReportGroup({
    name,
    createdBy,
    teamId,
    teamName,
    createdById,
    createdDate: new Date(),
    reports: []
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

const flattenAllReportData = data => {
  if (!data) return;
  
  const reducer = {
    reportGroups: [],
    reports: []
  }
  
  return data.reduce((acc, cur) => {
    const {reportGroups, reports} = cur;
    acc.reportGroups = acc.reportGroups.concat(reportGroups);
    acc.reports = acc.reports.concat(reports);
    return acc;
  }, reducer);
}

const mergeReportsAndGroups = (reports, reportGroups) => {
  if (!reports || !reportGroups) return;
  
  const reportGroupMap = reportGroups.reduce((acc, cur) => {
    acc[cur.id] = cur.clientProps;
    return acc;
  }, {});

  return reports.reduce((acc, cur) => {
    const reportGroup = acc[cur.groupName];
    if (!reportGroup) {
      return acc;
    }
    if (!reportGroup.reportList) {
      reportGroup.reportList = [];
    } 
    reportGroup.reportList.push(cur.clientProps);
    return acc;
  }, reportGroupMap)
}

function getAllReports(cb) {
  Team
    .find({}, {reportGroups: 1, reports: 1})
    .exec(function(err, data) {
      if (err || !data) return cb('Error getting reports');
      
      const {reportGroups, reports} = flattenAllReportData(data);
      
      const result = mergeReportsAndGroups(reports, reportGroups);
      return cb(undefined, result);
    });
}

function getReportCollectionCounts(reportCollection) {
  if (!reportCollection) return;
  const groupCount = reportCollection.length;
  const reportCount =  reportCollection.reduce((acc, cur) => acc + cur.reports.length, 0);
  return {
    groupCount,
    reportCount
  }
}

module.exports = {
  buildReportModel,
  buildReportGroupModel,
  createReportLog,
  getAllReports,
  getReportCollectionCounts
}