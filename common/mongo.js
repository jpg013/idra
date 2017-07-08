const mongoose  = require('mongoose');
const user      = require('../models/userModel');
const team      = require('../models/teamModel');

const findUser = (query, cb) => user.findOne(query).populate('team').exec(cb);
const findTeamById = (id, cb) => team.findById(id, cb);
const generateObjectId = id => id ? mongoose.Types.ObjectId(id) : mongoose.Types.ObjectId();

const lookupTeamReport = (team, reportSetId, reportId) => {
  if (!team || !reportSetId || !reportId) return;
  const reportSet = team.reportSets.find(cur => cur.id === reportSetId);
  if (!reportSet) return;
  return reportSet.reports.find(cur => cur.id === reportId);
}

module.exports = {
  generateObjectId,
  findUser,
  findTeamById,
  lookupTeamReport
};
