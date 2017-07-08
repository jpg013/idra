const express        = require('express')
const authController = express.Router();
const jwt            = require('jsonwebtoken');
const cryptoClient   = require('../common/crypto');
const UserService    = require('../services/user.service');

const loginFailedMsg = "Login failed. Invalid username / password.";
const loginErrMsg = "An error occurred while logging in";

const loginUser = (req, res) => {
  const {email, password, rememberMe} = req.body;
  
  if (!email || !password) {
    return res.status(400).send({msg: loginFailedMsg});
  }
  
  UserService.findUserByUsername(email, function(err, userModel) {
    if (err) return res.json({success: false, msg: loginErrMsg});
    if (!userModel) return res.json({success: false, message: loginFailedMsg});

    if (req.body.password !== cryptoClient.decrypt(userModel.password)) {
      return res.json({ success: false, message: loginFailedMsg });
    }

    const userClientData = userModel.clientProps;

    const expiresIn = req.body.rememberMe ? (30 * 24 * 60 * 60) : (24 * 60 * 60)
    const token = jwt.sign(userClientData, process.env.AUTH_TOKEN_SECRET, { expiresIn: expiresIn });

    res.json({
      success: true,
      token: token,
      user: userClientData
    });
  });
};

/**
 * Controller Routes
 */
authController.post('/login', loginUser);

module.exports = authController;
