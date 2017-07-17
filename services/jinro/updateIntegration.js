const IntegrationService = require('../integrationService');
const sendUpdateToClient = require('./sendClientUpdate');

const updateIntegration = (id, params, cb) => {
  IntegrationService.updateIntegration(id, params, (err, integrationModel) => {
    sendUpdateToClient(id);    
    cb(err, integrationModel);
  });
} 

module.exports = updateIntegration;