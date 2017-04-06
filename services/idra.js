const express  = require('express')
const neo4j    = require('neo4j');
const json2csv = require('json2csv');

const query = `// DEMO 6 Alumni Athelete Giving by Sport - Fund, Amount, Date
      MATCH (a:Sports {name:'BASEBALL'})-[]-(n:Alumni)-[]-(b:Fund)
      WITH a, n, b
      ORDER BY b.date DESC
      WITH a, n, HEAD(COLLECT(b)) as b
      RETURN n.name as name, n.BBid as id, n.rtg1category as Rating1Cat, n.rtg1description as 
      Rating1Desc, n.rtg2category as Rating2Cat, n.rtg2description as Rating2Desc, 
      n.rtg3category as Rating3Cat, n.rtg3description as Rating3Desc, n.rtg4category as Rating4Cat, 
      n.rtg4description as Rating4Desc, n.rtg5category as Rating5Cat, n.rtg5description as Rating5Desc,
      n.totalgiving as totalgifts, a.name as Sport, b.name as Fund, b.date as date, b.amount as amount`;

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
    
    db.cypher({query: query}, function(err, data) {
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
