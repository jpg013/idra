const integrationService = require('../../integrationService');

const setTwitterUserProfile = (integrationId, userId, profile, cb) => {
  const params = {
    id: integrationId,
    userId,
    mediaId: profile.id
  }
  integrationService.setUserProfile(params, err => cb(err));
}

module.exports = setTwitterUserProfile;