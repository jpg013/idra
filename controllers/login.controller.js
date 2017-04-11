const express         = require('express')
const loginController = express.Router();
const jwt             = require('jsonwebtoken');
const cryptoClient    = require('../common/crypto');
const usersService    = require('../services/users.service');

const loginFailedMsg = "Login failed. Invalid username / password.";
const loginErrMsg = "An error occurred while logging in";

const loginUser = (req, res) => {
  const {email, password, rememberMe} = req.body;
  
  if (!email || !password) {
    return res.status(400).send({msg: loginFailedMsg});
  }
  
  usersService.findUserByUsername(email, function(err, userModel) {
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
loginController.post('/login', loginUser);

module.exports = loginController;
