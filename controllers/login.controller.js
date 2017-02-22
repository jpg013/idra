const express        = require('express')
const loginRouter    = express.Router();
const user           = require('../models/user.model');
const jwt            = require('jsonwebtoken');
const Config         = require('../config');
const loginFailedMsg = "Login failed. Invalid username / password.";
const Common         = require('../common');

loginRouter.post('/login', function(req, res) {
  // Query the user
  user
    .findOne({email: req.body.email})
    .populate('team')
    .exec(function(err, user) {
      console.log(user);
      if (err) throw err;
      if (!user) {
        return res.json({success: false, message: loginFailedMsg});
      }

      if (req.body.password !== Common.decrypt(user.password)) {
        return res.json({ success: false, message: loginFailedMsg })
      }

      // Remove the user password property
      const {email, firstName, lastName, createdDate, role, _id, team} = user;
      const data = {email, firstName, lastName, createdDate, role, _id, team};
      const expiresIn = req.body.rememberMe ? (30 * 24 * 60 * 60) : (24 * 60 * 60)
      const token = jwt.sign(user, Config.authTokenSecret, { expiresIn: expiresIn });

      res.json({
        success: true,
        token: token,
        user: data
      })
   });
});

module.exports = loginRouter;
