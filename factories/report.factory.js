const Report           = require('../models/report.model'); 
const ReportSet        = require('../models/report-set.model'); 
const ReportLog        = require('../models/report-log.model');
const ReportRequest    = require('../models/report-request.model');

function validateReportRequestFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.request ||
      !fields.request.trim().length ||
      !fields.userId ||
      !fields.reportSetId
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
      !fields.createdBy ||
      !fields.reportSetId ||
      !fields.teamId
     ) { return false; }
  return true;
}

function validateReportSetFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.name ||
      (fields.name.trim().length < 3) || 
      !fields.createdBy ||
      !fields.teamId
     ) { return false; }
  return true;
}

function scrubReportData(data) {
  if (!data || typeof data !== 'object') return {};
  const {name, user, description, query, reportSetId, teamId} = data;
  if (!user) return; 
  const createdBy = {
    userId: user.id,
    userName: `${user.firstName} ${user.lastName}`
  };
  
  return {
    name, 
    createdBy, 
    description,
    query,
    reportSetId,
    teamId
  };
}

function scrubReportSetData(data) {
  if (!data || typeof data !== 'object') return {};
  const { name, createdBy, teamId } = data;
  return { 
    name,
    createdBy,
    teamId
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
  const {userId, reportSetId, request} = data;
  return {
    userId,
    reportSetId,
    request
  }
}

function buildReportModel(reportFields) {
  const modelProps = Object.assign({}, reportFields);
  return Report(modelProps);
}

function buildReportSetModel(reportSetFields) {
  const modelProps = Object.assign({}, reportSetFields);
  return ReportSet(modelProps);
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
  buildReportSetModel,
  buildReportLogModel,
  buildReportModel,
  buildReportRequestModel,
  scrubReportData,
  scrubReportSetData,
  scrubReportLogData,
  scrubReportRequestData,
  validateReportFields,
  validateReportSetFields,
  validateReportLogFields,
  validateReportRequestFields
}