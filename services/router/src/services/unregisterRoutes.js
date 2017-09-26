const databaseConnector = require('../db/connector');

const unregister = (containerName, cb) => {
  if (!containerName) {
    return cb('Bad request data.');
  }
  
  databaseConnector.getConnection((err, db) => {
    if (err) {
      return cb(err);
    }
    
    if (!db) {
      return cb('Could not connect to database.');
    }
    
    const col = db.collection('routing');
    const $query = { containerName };
    
    col.deleteOne($query, deleteErr => {
      if (deleteErr) {
        return cb('There was an error updating the registry.');
      }
      cb();
    });
  });
};

module.exports = unregister;