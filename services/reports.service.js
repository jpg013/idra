const Report = require('../models/report.model');

function buildReportModel(reportData) {
  const {name, description, query, collectionName} = reportData;
  return Report({
    name,
    description,
    query,
    collectionName,
    createdDate: new Date()
  })
}

module.exports = {
  buildReportModel
}