const createCollections = require('./collections').createCollections;
const dbConnector       = require('./connector');

const setup = callback => {
  dbConnector.getConnection((err, database) => {
    if (err) {
      return callback(err);
    }
    createCollections(database, callback);
  });
};

module.exports = setup;
