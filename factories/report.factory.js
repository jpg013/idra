const Report           = require('../models/report.model'); 
const ReportCollection = require('../models/report-collection.model'); 
const ReportLog        = require('../models/report-log.model');
const ReportRequest    = require('../models/report-request.model');

function validateReportRequestFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.request ||
      !fields.request.trim().length ||
      !fields.userId ||
      !fields.reportCollectionId
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
      !fields.reportCollectionId
     ) { return false; }
  return true;
}

function validateReportCollectionFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  if (!fields.name ||
      (fields.name.trim().length < 3) || 
      !fields.createdBy
     ) { return false; }
  return true;
}

function scrubReportData(data) {
  if (!data || typeof data !== 'object') return {};
  const {name, createdBy, description, query, reportCollectionId} = data;
  return {
    name, 
    createdBy, 
    description,
    query,
    reportCollectionId
  };
}

function scrubReportCollectionData(data) {
  if (!data || typeof data !== 'object') return {};
  const { name, createdBy } = data;
  return { 
    name,
    createdBy
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
  const {userId, reportCollectionId, request} = data;
  return {
    userId,
    reportCollectionId,
    request
  }
}

function buildReportModel(reportFields) {
  const modelProps = Object.assign({}, reportFields);
  return Report(modelProps);
}

function buildReportCollectionModel(reportCollectionFields) {
  const modelProps = Object.assign({}, reportCollectionFields, {
    reportList: []
  });
  return ReportCollection(modelProps);
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
  buildReportCollectionModel,
  buildReportLogModel,
  buildReportModel,
  buildReportRequestModel,
  scrubReportData,
  scrubReportCollectionData,
  scrubReportLogData,
  scrubReportRequestData,
  validateReportFields,
  validateReportCollectionFields,
  validateReportLogFields,
  validateReportRequestFields
}