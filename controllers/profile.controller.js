const express           = require('express')
const cryptoClient      = require('../common/crypto');
const UserService       = require('../services/user.service');
const UserFactory       = require('../factories/user.factory');
const profileController = express.Router();

const passwordChangeErrMsg = 'There was an error changing the password.'

function updatePassword(req, res) {
  let { userId, oldPassword, newPassword } = req.body;
  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).send({success: false, msg: passwordChangeErrMsg});
  }
  
  /* Is user password valid */
  if (!UserFactory.isValidUserPassword(newPassword));

  oldPassword = cryptoClient.encrypt(oldPassword);
  newPassword = cryptoClient.encrypt(newPassword);
  
  /* Validate that the user id is same as the token */
  if (req.authTokenData.id !== userId) {
    return res.status(401).send({success: false, msg: passwordChangeErrMsg});
  }

  UserService.findUser(userId, function(err, userModel) {
    if (err || !userModel) {
      return res.status(403).send({success: false, msg: passwordChangeErrMsg});
    }
    if (userModel.password !== oldPassword) {
      return res.status(400).send({success: false, msg: 'Current password is incorrect'});
    }
    if (userModel.password === newPassword) {
      return res.status(4010).send({success: false, msg: 'New password cannot be the same'});
    }

    const update = {
      password: newPassword,
      passwordChangeRequired: false
    };

    UserService.updateUserModel(userModel.id, update, function(err, updatedUserModel) {
      if (err) {
        return res.status(401).send({success: false, msg: passwordChangeErrMsg});
      }
      return res.status(200).send({success: true, data: updatedUserModel});
    });
  });
}

/**
 * Controller Routes
 */
profileController.put('/password', updatePassword);

module.exports = profileController;
