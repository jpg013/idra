const express      = require('express');
const neo4j        = require('neo4j');
const cryptoClient = require('../common/crypto');
const json2csv     = require('json2csv');

function Idra() {
  const convertToCsv = data => {
    if (!data || !data.length) return [];
    const fields = Object.keys(data[0]);
    return json2csv({ data, fields });
  }
  
  const getDevCreds = () => {
    return {
      connection : 'http://localhost:7474/',
      auth : 'neo4j:Innosolpro2016**'
    }
  }

  const decryptNeo4jCreds = creds => {
    return {
      connection: cryptoClient.decrypt(userModel.team.neo4jConnection),
      auth: cryptoClient.decrypt(userModel.team.neo4jAuth)   
    }
  }
  
  const runReport = (args, cb) => {
    if (!args) return cb('missing required data');
    creds = (process.env.ENV_NAME === 'PRODUCTION') ? {connection: args.connection, auth: args.auth} : getDevCreds();
    
    const db = new neo4j.GraphDatabase({
      url: creds.connection,
      auth: creds.auth,
      headers: {},    // optional defaults, e.g. User-Agent
      proxy: null,    // optional URL
      agent: null,    // optional http.Agent instance, for custom socket pooling
    });
    
    db.cypher({query: args.query}, function(err, results) {
      if (err || !results) {
        return cb(err, results);
      }
      cb(err, convertToCsv(results));
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
