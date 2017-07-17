const integrationService = require('../../integrationService');

const setTwitterFollowers = (integrationId, userId, followers=[], cb) => {
  const params = {
    id: integrationId,
    userId,
    followers
  }
  integrationService.setUserFollowerList(params, err => cb(err));
}

module.exports = setTwitterFollowers;