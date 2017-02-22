const Express    = require('express')
const UserRouter = Express.Router();
const User       = require('../models/user.model');
const Team       = require('../models/team.model');
const Common     = require('../common');

// define the about route
UserRouter.put('/', function(req, res) {
  res.json({ success: true });
});

UserRouter.get('/', function(req, res) {
  User.find({}, function(err, users) {
    res.json({users: users});
  });
});

UserRouter.post('/', function (req, res) {
  Team.findOne({name: 'Innosol Test Team'}, (err, resp) => {
    // TODO: error handling
    const userModel = new User({
      firstName: 'justin',
      lastName: 'Graber',
      password: Common.encrypt('password'),
      email: 'jpg013@gmail.com',
      role: 'sys-admin',
      id: Common.generateObjectId(),
      team: resp.id
    });

    userModel.save(function(err) {
      if (err) throw err;
      console.log('User saved successfully');
      res.json({ success: true });
    });
  })
});

module.exports = UserRouter;
