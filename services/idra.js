'use strict';

const express      = require('express');
const neo4j        = require('neo4j');
const cryptoClient = require('../common/crypto');
const json2csv     = require('json2csv');

/**
 * Queries
 */

const upsertFriendsQuery = `MATCH (targetNode:Alumni {screen_name: {twitterID}})
                            UNWIND {friends} as otherUserName
                            MATCH (otherUser {screen_name: otherUserName.twitterID})
                            MERGE (targetNode)-[:Follows]->(otherUser)`;

const upsertFollowersQuery = `MATCH (followerNode:Alumni {screen_name: {twitterID}})
                              UNWIND {followers} as otherUserName
                              MATCH (otherUser {screen_name: otherUserName.twitterID})
                              MERGE (FollowerNode)-[:Follows]->(otherUser)`;

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

  const decryptCreds = (creds={}) => {
    return {
      connection: cryptoClient.decrypt(creds.connection),
      auth: cryptoClient.decrypt(creds.auth)   
    }
  }
  
  const runReport = (opts={}, cb) => {
    const creds = (process.env.ENV_NAME === 'PRODUCTION') ? decryptCreds({connection: opts.connection, auth: opts.auth}) : getDevCreds();
    
    const db = new neo4j.GraphDatabase({
      url: creds.connection,
      auth: creds.auth,
      headers: {},    // optional defaults, e.g. User-Agent
      proxy: null,    // optional URL
      agent: null,    // optional http.Agent instance, for custom socket pooling
    });
    
    db.cypher({query: opts.query}, function(err, results) {
      if (err || !results) {
        return cb(parseNeo4jError(err), results);
      }
      cb(err, convertToCsv(results));
    });
  }

  const testNeo4jCredentials = () => {
    
  }

  const getTwitterScreenNames = (opts={}, cb) => {
    const creds = (process.env.ENV_NAME === 'PRODUCTION') ? decryptCreds({connection: opts.connection, auth: opts.auth}) : getDevCreds();
    
    const db = new neo4j.GraphDatabase({
      url: creds.connection,
      auth: creds.auth,
      headers: {},    // optional defaults, e.g. User-Agent
      proxy: null,    // optional URL
      agent: null,    // optional http.Agent instance, for custom socket pooling
    });

    const query = `MATCH (n:Alumni) WHERE n.screen_name IS NOT NULL RETURN n.name as name, n.BBid as id, n.screen_name as twitterID`;
    
    db.cypher({query}, cb);
  }

  function upsertManyAndFollowers(opts, cb) {
    const {twitterID, followers, neo4jCredentials} = opts;
    if (!twitterID || !followers || !neo4jCredentials) return cb('missing required options');
    
    const creds = (process.env.ENV_NAME === 'PRODUCTION') ? decryptCreds({connection: opts.connection, auth: opts.auth}) : getDevCreds();
    const params = {twitterID, followers};

    const db = new neo4j.GraphDatabase({
      url: creds.connection,
      auth: creds.auth,
      headers: {},    // optional defaults, e.g. User-Agent
      proxy: null,    // optional URL
      agent: null,    // optional http.Agent instance, for custom socket pooling
    });

    db.cypher({ query: upsertFollowersQuery, params }, cb);
  }

  function upsertManyAndFriends(opts, cb) {
    const {twitterID, friends, neo4jCredentials} = opts;
    if (!twitterID || !friends || !neo4jCredentials) return cb('missing required options');
    
    const creds = (process.env.ENV_NAME === 'PRODUCTION') ? decryptCreds({connection: opts.connection, auth: opts.auth}) : getDevCreds();
    const params = {twitterID, friends};

    const db = new neo4j.GraphDatabase({
      url: creds.connection,
      auth: creds.auth,
      headers: {},    // optional defaults, e.g. User-Agent
      proxy: null,    // optional URL
      agent: null,    // optional http.Agent instance, for custom socket pooling
    });
    
    db.cypher({ query: upsertFriendsQuery, params }, cb);
  }

  function parseNeo4jError(err) {
    if (!err) return;
    switch(err.neo4j.code) {
      case 'Neo.ClientError.Statement.SyntaxError':
        return 'Invalid Neo4j cypher syntax';
      default:
        return 'There was an error querying Neo4j';
    }
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
