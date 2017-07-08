const Report           = require('../models/reportModel');
const ReportLog        = require('../models/reportLogModel');
const ReportRequest    = require('../models/reportRequestModel');

function validateReportRequestFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.request ||
      !fields.request.trim().length ||
      !fields.userId
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
      !fields.teamId
     ) { return false; }
  return true;
}

function scrubReportData(data) {
  if (!data || typeof data !== 'object') return {};
  const {name, user, description, query, teamId} = data;
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
  const {userId, request} = data;
  return {
    userId,
    request
  }
}

function buildReportModel(reportFields) {
  const modelProps = Object.assign({}, reportFields);
  return Report(modelProps);
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
  buildReportLogModel,
  buildReportModel,
  buildReportRequestModel,
  scrubReportData,
  scrubReportLogData,
  scrubReportRequestData,
  validateReportFields,
  validateReportLogFields,
  validateReportRequestFields
}
