const express           = require('express')
const cryptoClient      = require('../common/crypto');
const usersService      = require('../services/users.service');
const profileController = express.Router();

const passwordChangeErrMsg = 'There was an error changing the password.'

function updatePassword(req, res) {
  let { userId, oldPassword, newPassword } = req.body;
  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).send({success: false, msg: passwordChangeErrMsg});
  }
  
  /* Is user password valid */
  if (!usersService.isValidUserPassword(newPassword));

  oldPassword = cryptoClient.encrypt(oldPassword);
  newPassword = cryptoClient.encrypt(newPassword);
  
  /* Validate that the user id is same as the token */
  if (req.authTokenData.id !== userId) {
    return res.status(401).send({success: false, msg: passwordChangeErrMsg});
  }

  usersService.findUser(userId, function(err, userModel) {
    if (err || !userModel) {
      return res.status(401).send({success: false, msg: passwordChangeErrMsg});
    }
    if (userModel.password !== oldPassword) {
      return res.status(401).send({success: false, msg: 'Current password is incorrect'});
    }
    if (userModel.password === newPassword) {
      return res.status(401).send({success: false, msg: 'New password cannot be the same'});
    }
    usersService.updateUserModel(userModel.id, {password: newPassword}, function(err, userModel) {
      if (err) {
        return res.status(401).send({success: false, msg: passwordChangeErrMsg});
      }
      return res.status(200).send({success: true, data: userModel});
    });
  });
}

/**
 * Controller Routes
 */
profileController.put('/password', updatePassword);

module.exports = profileController;
