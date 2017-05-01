'use strict';

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
    const creds = (process.env.ENV_NAME === 'PRODUCTION') ? {connection: args.connection, auth: args.auth} : getDevCreds();
    
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

  const getTwitterScreenNames = (opts, cb) => {
    if (!opts) return cb('missing required data');
    const creds = (process.env.ENV_NAME === 'PRODUCTION') ? {connection: args.connection, auth: args.auth} : getDevCreds();
    
    const db = new neo4j.GraphDatabase({
      url: creds.connection,
      auth: creds.auth,
      headers: {},    // optional defaults, e.g. User-Agent
      proxy: null,    // optional URL
      agent: null,    // optional http.Agent instance, for custom socket pooling
    });

    const query = `MATCH (n:Alumni) WHERE n.screen_name IS NOT NULL RETURN n.name as name, n.BBid as id, n.screen_name as TwitterID`;
    
    db.cypher({query}, cb);
  }

  function upsertManyAndFollowers(opts, cb) {
    const { screenName, userList } = opts;
    if (!screenName || !userList) return cb('missing required options');
    const query = `MATCH (followerNode:Alumni {screen_name: {screenName}})
                  UNWIND {userList} as otherUserName
                  MATCH (otherUser {screen_name: otherUserName.screen_name})
                  MERGE (FollowerNode)-[:FOLLOWS]->(otherUser)`;
    
    const creds = (process.env.ENV_NAME === 'PRODUCTION') ? {connection: opts.connection, auth: opts.auth} : getDevCreds();
    const params = {screenName, userList};

    const db = new neo4j.GraphDatabase({
      url: creds.connection,
      auth: creds.auth,
      headers: {},    // optional defaults, e.g. User-Agent
      proxy: null,    // optional URL
      agent: null,    // optional http.Agent instance, for custom socket pooling
    });

    db.cypher({ query, params }, cb);
  }

  function upsertManyAndFriends(opts, cb) {
    const { screenName, userList } = opts;
    if (!screenName || !userList) return cb('missing required options');
    const query = `MATCH (targetNode:Alumni {screen_name: {screenName}})
                    UNWIND {userList} as otherUserName
                    MATCH (otherUser {screen_name: otherUserName.screen_name})
                    MERGE (targetNode)-[:FOLLOWS]->(otherUser)`;
    
    const creds = (process.env.ENV_NAME === 'PRODUCTION') ? {connection: opts.connection, auth: opts.auth} : getDevCreds();
    const params = {screenName, userList};

    const db = new neo4j.GraphDatabase({
      url: creds.connection,
      auth: creds.auth,
      headers: {},    // optional defaults, e.g. User-Agent
      proxy: null,    // optional URL
      agent: null,    // optional http.Agent instance, for custom socket pooling
    });

    db.cypher({ query, params }, cb);
  }
  
  return {
    runReport,
    testNeo4jCredentials,
    getTwitterScreenNames,
    upsertManyAndFriends,
    upsertManyAndFollowers
  }
}

module.exports = Idra();
