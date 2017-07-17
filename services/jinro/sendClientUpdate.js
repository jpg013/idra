const IntegrationService = require('../integrationService');
const SocketIO           = require('../../socket/io');

const sendUpdateToClient = id => {
  IntegrationService.getIntegration(id, (err, integrationModel={}) => {
    if (err || !integrationModel) {
      return;
    }
    SocketIO.handleIntegrationUpdate(integrationModel);
  });
}

module.exports = sendUpdateToClient;