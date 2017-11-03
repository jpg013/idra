const dbSettings = {
  db: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  repl: process.env.DB_REPLS || 'rs1',
  server: process.env.DB_SERVER,
  dbParameters: () => ({
    w: 'majority',
    wtimeout: 10000,
    j: true,
    readPreference: 'ReadPreference.SECONDARY_PREFERRED',
    native_parser: false
  }),
  serverParameters: () => ({
    autoReconnect: true,
    poolSize: 10,
    socketoptions: {
      keepAlive: 300,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    }
  }),
  replsetParameters: (replset = 'rs1') => ({
    replicaSet: replset,
    ha: true,
    haInterval: 10000,
    poolSize: 10,
    socketoptions: {
    keepAlive: 300,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    }
  }),
  collections: {
    'twitter_jobs': {},
    'twitter_user_connections': {},
    'twitter_rate_limits': {},
    'twitter_credentials': {}
  }
}

const serverSettings = {
  port: process.env.CONTAINER_PORT
}

const neo4jCredentials = {
  url: process.env.NEO4J_CONNECTION || 'http://localhost:7474/',
  auth: process.env.NEO4J_AUTH || 'dev:password'
}

module.exports = Object.assign({}, { dbSettings, serverSettings, neo4jCredentials })
