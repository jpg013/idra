const integrationService = require('../../integrationService');

const setUserHasBeenSynced = (integrationId, userId, cb) => {
  const params = {
    id: integrationId,
    userId,
  }
  integrationService.setUserHasBeenSynced(params, err => cb(err));
}

module.exports = setUserHasBeenSynced;