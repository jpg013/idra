const express      = require('express')
const jwt          = require('jsonwebtoken');
const cryptoClient = require('../common/crypto');
const UserService  = require('../services/userService');

const authController  = express.Router();
const signInFailedMsg = 'Sign In failed. Invalid username/password.';
const signInErrorMsg  = 'An error occurred while signing in';

const signUserIn = (req, res) => {
  const {username, password, rememberMe} = req.body;
  
  if (!username || !password) {
    return res.status(400).send({msg: signInErrorMsg});
  }
  
  UserService.findUserByUsername(username, function(err, userModel) {
    if (err) {
      return res.json({success: false, msg: signInErrorMsg});
    }
    
    if (!userModel) {
      return res.json({success: false, message: signInFailedMsg});
    }

    if (req.body.password !== cryptoClient.decrypt(userModel.password)) {
      return res.json({ success: false, message: signInFailedMsg });
    }

    const userClientData = userModel.clientProps;

    const expiresIn = (24 * 60 * 60);
    
    const token = jwt.sign(
      userClientData, 
      process.env.AUTH_TOKEN_SECRET, 
      {  expiresIn }
    );

    res.json({
      success: true,
      token: token,
      user: userClientData,
      expiresIn
    });
  });
};

/**
 * Controller Routes
 */
authController.post('/signin', signUserIn);

module.exports = authController;
