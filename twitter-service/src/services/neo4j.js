const neo4j = require('neo4j')

const twitterScreenNameQuery = `MATCH (n) WHERE n.Twitter_ID IS NOT NULL RETURN n.name as name, n.id as id, n.Twitter_ID as TwitterID`
//const twitterScreenNameQuery = `MATCH (n:Alumni) WHERE n.screen_name IS NOT NULL RETURN n.name as name, n.id as id, n.screen_name as twitterID`;

const parseNeo4jError = err => {
  switch(err.neo4j.code) {
    case 'Neo.ClientError.Statement.SyntaxError':
      return 'Invalid Neo4j cypher syntax';
    default:
      return 'There was an error querying Neo4j';
  }
}

const neo4jService = container => {
  const { url, auth } = container.resolve('neo4jCredentials')
  const db = new neo4j.GraphDatabase({
      url,
      auth,
      headers: {},    // optional defaults, e.g. User-Agent
      proxy: null,    // optional URL
      agent: null,    // optional http.Agent instance, for custom socket pooling
  });

  const getTwitterScreenNames = (opts={}, cb) => {
    return new Promise((resolve, reject) => {
      const $query = { query: twitterScreenNameQuery }

      db.cypher($query, (err, results) => {
        if (err) {
          return reject(err);
        }

        results = results.slice(0, 10)

        console.log(results)

        return resolve(results.map(cur => {
          const { name, id, twitterID } = cur

          return Object.assign({},  {
            screenName: twitterID,
            name,
            id
          })
        }));
      });
    });
  }

  return Object.create({
    getTwitterScreenNames
  })
}

module.exports = neo4jService;
