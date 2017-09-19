const MongoClient = require('mongodb').MongoClient;

// Holds the database connection
let _database;

const isConnected = () => !!_database && _database.serverConfig.isConnected();

const openConnection = callback => {
  if (isConnected()) {
    return callback(undefined, _database);
  }
  
  MongoClient.connect(process.env.MONGODB_CONNECTION, (err, db) => {
    if (err) {
      console.warn('%s MongoDB connection error. Please make sure MongoDB is running. ', err);
    } else {
      _database = db;
    }
    callback(err, _database);
  });
};

const getConnection = cb => {
  if (isConnected()) {
    return cb(undefined, _database);
  }
  return openConnection(cb);
};

module.exports = {
  openConnection,
  getConnection,
  isConnected
};
