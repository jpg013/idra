const async                       = require('async');
const dialUpsertServiceDefinition = require('./dialUpsertServiceDefinition');
const dialUpsertServiceRoutes     = require('./dialUpsertServiceRoutes');

const handleServiceSummarySuccess = (results, cb) => {
  const seedPipe = next => next(undefined, results);
  async.waterfall([seedPipe, dialUpsertServiceDefinition, dialUpsertServiceRoutes], cb);
};

module.exports = handleServiceSummarySuccess;
