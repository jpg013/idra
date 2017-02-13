const express        = require('express')
const loginRouter    = express.Router();
const user           = require('../models/user.model');
const jwt            = require('jsonwebtoken');
const config         = require('../config');
const loginFailedMsg = "Login failed. Invalid username / password.";

loginRouter.post('/login', function(req, res) {
  // Query the user
  user.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      return res.json({success: false, message: loginFailedMsg});
    }

    if (user.password !== req.body.password) {
      return res.json({ success: false, message: loginFailedMsg })
    }

    // User is authenticated, supply a JWT
    const token = jwt.sign(user, config.tokenSecret, {
      expiresInMinutes: 1440 // 24 hours
    });

    res.json({
      success: true,
      token: token
    })
  });
});

module.exports = loginRouter;
