const mongo         = require('../../common/mongo');
const express        = require('express')
const reportRouter   = express.Router();
const report         = require('../../models/report.model');
const reportSet      = require('../../models/report-set.model');
const neo4j          = require('neo4j');

const db = new neo4j.GraphDatabase({
  url: 'http://neo4j:neo4j@localhost:7474',
  auth: 'neo4j:Innosolpro2016**',
  headers: {},    // optional defaults, e.g. User-Agent
  proxy: null,    // optional URL
  agent: null,    // optional http.Agent instance, for custom socket pooling
});

reportRouter.post('/', function(req, res) {
  res.json({msg: 'hi'})
})

reportRouter.post('/download', function(req, res) {
  mongo.findUser({_id: req.authTokenUser._id}, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.json({success: false, msg: 'unable to find user'});
    }
    /* Attempt to lookup the report associated */
    const report = mongo.lookupTeamReport(user.team, req.body.reportSetId, req.body.reportId)

    if (!report) {
      res.json({
        success: false,
        msg: 'invalid report'
      });
    }

    /* Query Neo4j with the report query */
    const stream = db.cypher({query: report.query}, function(err, results) {
      if (err) throw err;
      setTimeout(function() {
        res.json({
          success: true,
          results: results
        })
      }, 3000);
    })
  })
});

module.exports = reportRouter;
