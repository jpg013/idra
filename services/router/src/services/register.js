const databaseConnector = require('../db/connector');

const register = (registryData, cb) => {
  const { containerName, containerPort, routes } = registryData;
  
  if (!containerName || !containerPort || !routes) {
    return cb('Bad request data.');
  }
  
  databaseConnector.getConnection((err, db) => {
    if (err) {
      return cb(err);
    }
    
    if (!db) {
      return cb('Could not connect to database.');
    }
    
    const col = db.collection('registry');
    const $query = { containerName };
    const $set = { containerName, containerPort, routes };
    const $opts = { upsert: true };
    
    col.updateOne($query, $set, $opts, updateErr => {
      if (updateErr) {
        return cb('There was an error updating the registry');
      }
      cb();
    });
  });
};

module.exports = register;
