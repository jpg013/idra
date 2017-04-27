const Report        = require('../models/report.model'); 
const ReportGroup   = require('../models/report-group.model'); 
const ReportLog     = require('../models/report-log.model');
const ReportRequest = require('../models/report-request.model');

function validateReportRequestFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.request ||
      !fields.request.trim().length ||
      !fields.userId ||
      !fields.reportGroupId
     ) { return false; }
  return true;
}

function validateReportLogFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.userId || !fields.reportId) return false;
  return true;
}

function validateReportFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.name || 
      !fields.description || 
      !fields.query || 
      !fields.groupId || 
      !fields.teamId || 
      !fields.createdBy || 
      !fields.createdById || 
      !fields.teamName
     ) { return false; }
  return true;
}

function validateReportGroupFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.name ||
      (fields.name.trim().length < 3) || 
      !fields.createdBy ||
      !fields.createdById ||
      !fields.teamId ||
      !fields.teamName
     ) { return false; }
  return true;
}

function scrubReportData(data) {
  if (!data || typeof data !== 'object') return {};
  const {name, description, query, groupId, createdBy, createdById, teamId, teamName} = data;
  return {
    name, 
    description, 
    query, 
    groupId, 
    teamId, 
    createdBy , 
    createdById, 
    teamName
  };
}

function scrubReportGroupData(data) {
  if (!data || typeof data !== 'object') return {};
  const { name, createdBy, createdById, teamId, teamName } = data;
  return { 
    name, 
    createdBy, 
    createdById, 
    teamId, 
    teamName 
  };
}

function scrubReportLogData(data) {
  if (!data || typeof data !== 'object') return {};
  const {userId, reportId} = data;
  return {
    userId,
    reportId
  }
}

function scrubReportRequestData(data) {
  if (!data || typeof data !== 'object') return {};
  const {userId, reportGroupId, request} = data;
  return {
    userId,
    reportGroupId,
    request
  }
}

function buildReportModel(reportFields) {
  const modelProps = Object.assign({}, reportFields, {
    downloadCount: 0,
    createdDate: new Date()
  });
  return Report(modelProps);
}

function buildReportGroupModel(reportGroupFields) {
  const modelProps = Object.assign({}, reportGroupFields, {
    createdDate: new Date(),
    reports: []
  });
  return ReportGroup(modelProps);
}

function buildReportLogModel(reportLogFields) {
  const modelProps = Object.assign({}, reportLogFields, {
    date: new Date()
  });
  return new ReportLog(modelProps);
}

function buildReportRequestModel(reportRequestFields) {
  const modelProps = Object.assign({}, reportRequestFields, {
    requestedDate: new Date()
  });
  return new ReportRequest(modelProps);
}

module.exports = {
  buildReportGroupModel,
  buildReportLogModel,
  buildReportModel,
  buildReportRequestModel,
  scrubReportData,
  scrubReportGroupData,
  scrubReportLogData,
  scrubReportRequestData,
  validateReportFields,
  validateReportGroupFields,
  validateReportLogFields,
  validateReportRequestFields
}