const express        = require('express')
const loginRouter    = express.Router();
const user           = require('../models/user.model');
const jwt            = require('jsonwebtoken');
const config         = require('../config');
const loginFailedMsg = "Login failed. Invalid username / password.";
const common         = require('../common');

loginRouter.post('/login', function(req, res) {
  // Query the user
  user.findOne({email: req.body.username}, function(err, user) {
    if (err) throw err;
    if (!user) {
      return res.json({success: false, message: loginFailedMsg});
    }

    if (user.password !== common.decrypt(req.body.password)) {
      return res.json({ success: false, message: loginFailedMsg })
    }

    // Remove the user password property
    delete user.password

    const token = jwt.sign(user, config.tokenSecret, {
      expiresInMinutes: 1440 // 24 hours
    });

    res.json({
      success: true,
      token: token,
      user: user
    })
  });
});

module.exports = loginRouter;
