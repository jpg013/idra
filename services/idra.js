const express = require('express')
const neo4j = require('neo4j');

/*
const db = new neo4j.GraphDatabase({
  url: 'http://neo4j:neo4j@localhost:7474',
  auth: 'neo4j:innosol',
  headers: {},    // optional defaults, e.g. User-Agent
  proxy: null,    // optional URL
  agent: null,    // optional http.Agent instance, for custom socket pooling
});
    const stream = db.cypher({query: report.query}, function(err, results) {
      if (err) throw err;
      setTimeout(function() {
        res.json({
          success: true,
          results: results
        })
      }, 3000);
    })
*/

function Idra() {
  
  const runReport = (reportModel) => {
    // Do Some stuff and run the report
  }
  
  return {
    runReport
  }
}

module.exports = Idra();
