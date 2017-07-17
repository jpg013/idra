const integrationService = require('../../integrationService');

const setTwitterFriends = (integrationId, userId, friends=[], cb) => {
  const params = {
    id: integrationId,
    userId,
    friends
  }
  integrationService.setUserFriendList(params, err => cb(err));
}

module.exports = setTwitterFriends;