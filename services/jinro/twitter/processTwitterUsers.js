const IntegrationService       = require('../../integrationService');
const secureTwitterCredential  = require('./secureTwitterCredential');
const updateTwitterIntegration = require('../updateIntegration');
const syncTwitterUser          = require('./syncTwitterUser');
const async                    = require('async');

const processTwitterUsers = (integrationModel, cb) => {
  if (!integrationModel) {
    return cb('Missing the required integration model.');
  }

  IntegrationService.getIntegrationUserList(integrationModel.id, (err, results) => {
    if (err) {
      return cb('An error occurred while fetcing the integration user list.');
    }
    const usersNeedingSynced = results.userList.filter(cur => !cur.hasBeenSynced)
      .slice(0, 30);
    
    async.eachSeries(
      usersNeedingSynced, 
      (user, next) => syncTwitterUser(user, integrationModel, next),
      cb
    );
  });
}

module.exports = processTwitterUsers;