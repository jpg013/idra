const IntegrationService = require('../integrationService');

const hasIntegrationBeenHalted = (id, cb) => {
  IntegrationService.getIntegrationStatus(id, function(err, status) {
    if (err) {
      return cb(err);
    }
    
    if (status === 'cancelled') {
      return cb('Integration has been cancelled.');
    }
    return cb();
  });
}

module.exports = hasIntegrationBeenHalted;