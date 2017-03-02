const Express      = require('express')
const UserRouter   = Express.Router();
const User         = require('../../models/user.model');
const Team         = require('../../models/team.model');
const mongoCommon  = require('../../common/mongo');
const cryptoCommon = require('../../common/crypto');

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
    console.log(resp);
    // TODO: error handling
    const userModel = new User({
      firstName: 'justin',
      lastName: 'Graber',
      password: cryptoCommon.encrypt('password'),
      email: 'jpg013@gmail.com',
      role: 'sys-admin',
      createdDate: new Date(),
      team: mongoCommon.generateObjectId(resp._id)
    });

    userModel.save(function(err) {
      if (err) throw err;
      res.json({ success: true });
    });
  })
});

module.exports = UserRouter;
