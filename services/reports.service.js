const lookupReport = (team, collectionId, reportId) => {
  if (!team || !collectionId || !reportId) return;
  const reportCollection = team.reportCollections.find(cur => cur.id === collectionId);
  if (!reportCollection) return;
  return reportCollection.reports.find(cur => cur.id === reportId);
}

module.exports = {
  lookupReport
}