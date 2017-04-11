const express  = require('express')
const neo4j    = require('neo4j');
const json2csv = require('json2csv');

function Idra() {
  const convertToCsv = (data) => {
    const fields = Object.keys(data[0]);
    return json2csv({ data, fields });
  }
  
  const runReport = (teamModel, reportModel, cb) => {
    if (!reportModel || !teamModel) return cb('missing required data');
    // Do Some stuff and run the report
    
    const db = new neo4j.GraphDatabase({
      url: teamModel.neo4jConnection,
      auth: teamModel.neo4jAuth,
      headers: {},    // optional defaults, e.g. User-Agent
      proxy: null,    // optional URL
      agent: null,    // optional http.Agent instance, for custom socket pooling
    });
    
    db.cypher({query: reportModel.query}, function(err, data) {
      if (err || !data) { return cb('error') }
      if (!data.length) {
        return cb(undefined, []);
      }
      return cb(undefined, convertToCsv(data));
    });
  }

  const testNeo4jCredentials = () => {

  }
  
  return {
    runReport,
    testNeo4jCredentials,
  }
}

module.exports = Idra();
