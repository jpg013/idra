const Express = require('express')
const UserRouter  = Express.Router();
const User    = require('../models/user.model');

// define the about route
UserRouter.put('/', function(req, res) {
  console.log('user router put getting called');
  res.json({ success: true });
});

UserRouter.get('/', function(req, res) {
  User.find({}, function(err, users) {
    res.json({users: users});
  });
});

UserRouter.get('/setup', function (req, res) {
  // create a sample user
 const user = new userModel({
   name: 'justin graber',
   password: 'password',
   admin: true
 });

 // save the sample user
  user.save(function(err) {
   if (err) throw err;
   console.log('User saved successfully');
   res.json({ success: true });
 });
});

module.exports = UserRouter;
