const express      = require('express')
const neo4j        = require('neo4j');
const cryptoClient = require('../common/crypto');

function Idra() {
  const convertToCsv = (data) => {
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
  
  const queryNeo4j = (query, creds, cb) => {
    if (!query || !creds) return cb('missing required data');
    creds = (process.env.ENV_NAME === 'PRODUCTION') ? creds : getDevCreds();
    
    const db = new neo4j.GraphDatabase({
      url: creds.connection,
      auth: creds.auth,
      headers: {},    // optional defaults, e.g. User-Agent
      proxy: null,    // optional URL
      agent: null,    // optional http.Agent instance, for custom socket pooling
    });
    
    db.cypher({query}, (err, data) => cb(err, data));
  }

  const testNeo4jCredentials = () => {

  }
  
  return {
    queryNeo4j,
    testNeo4jCredentials,
  }
}

module.exports = Idra();
