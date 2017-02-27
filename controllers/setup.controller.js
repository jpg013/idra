const express        = require('express')
const setupRouter    = express.Router();
const teamModel      = require('../models/team.model');
const userModel      = require('../models/user.model');
const reportSetModel = require('../models/report-set.model');
const reportModel    = require('../models/report.model');
const common         = require('../common');
const async          = require('async');

const reportData = [
  new reportModel({ name: 'test report 1',  createdDate: new Date(),  description: 'this is a description for a the report 1',  query: 'here is the cypher query for this !!!' }),
  new reportModel({ name: 'test report 2',  createdDate: new Date(),  description: 'this is a description for a the report 2',  query: 'here is the cypher query for this !!!' }),
  new reportModel({ name: 'test report 3',  createdDate: new Date(),  description: 'this is a description for a the report 3',  query: 'here is the cypher query for this !!!' }),
  new reportModel({ name: 'test report 4',  createdDate: new Date(),  description: 'this is a description for a the report 4',  query: 'here is the cypher query for this !!!' }),
  new reportModel({ name: 'test report 5',  createdDate: new Date(),  description: 'this is a description for a the report 5',  query: 'here is the cypher query for this !!!' }),
  new reportModel({ name: 'test report 6',  createdDate: new Date(),  description: 'this is a description for a the report 6',  query: 'here is the cypher query for this !!!' }),
  new reportModel({ name: 'test report 7',  createdDate: new Date(),  description: 'this is a description for a the report 7',  query: 'here is the cypher query for this !!!' }),
  new reportModel({ name: 'test report 8',  createdDate: new Date(),  description: 'this is a description for a the report 8',  query: 'here is the cypher query for this !!!' })
];

const removeTeams = cb => teamModel.collection.drop(cb);
const removeUsers = cb => userModel.collection.drop(cb);

setupRouter.post('/', function(req, res) {
  const defaultReportSet = new reportSetModel({
    name: 'default report set',
    createdDate: new Date(),
    reports: reportData
  });

  //const removeUsers = mongoose.connection.db.collection('users').drop;

  const team = new teamModel({
    name: 'Innosol Test Team',
    createdDate: new Date(),
    reportSets: [defaultReportSet]
  });

  const user = new userModel({
    firstName: 'Justin',
    lastName: 'Graber',
    password: common.encrypt('password'),
    email: 'jpg013@gmail.com',
    role: 'sys-admin',
    createdDate: new Date(),
    team: common.generateObjectId(team._id)
  });

  const addTeam = cb => team.save(cb);
  const addUser = cb => user.save(cb);

  async.series([removeTeams, removeUsers, addTeam, addUser], function(err) {
    return res.json({success: true});
  });
})

module.exports = setupRouter;
