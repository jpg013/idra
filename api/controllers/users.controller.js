const express         = require('express')
const usersController = express.Router();
const user            = require('../../models/user.model');
const team            = require('../../models/team.model');
const cryptoClient    = require('../../common/crypto');
const async           = require('async');

let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

usersController.put('/', function(req, res) {
  
});

usersController.get('/', function(req, res) {
  user.find()
    .populate('team')
    .exec(function(err, userModels) {
      if (err) throw err;
      const data = userModels.map(cur => cur.clientProps);
      res.json({data})
    }); 
});

usersController.post('/', function (req, res) {
  const { email, firstName, lastName, teamId, role, password } = req.body;
  if (!firstName || !lastName || !emailRegex.test(email) || !password) {
    return res.sendStatus(400);
  }

  const checkIfUserIsUnique = cb => {
    user.findOne({email}, function(err, userModel) {
      if (err) throw err;
      return userModel ? cb('A user with this email already exists') : cb();
    });
  }

  const verifyTeamExists = cb => {
    team.findOne({_id: teamId}, function(err, teamModel) {
      if (err) throw err;
      return teamModel ? cb(undefined) : cb('Team does not exist');
    })
  }

  const persistNewUser = (cb) => {
    const userModel = new user({
      email,
      firstName,
      lastName,
      teamId,
      role,
      password: cryptoClient.encrypt(password),
      createdDate: new Date(),
    });
    userModel.save(function(err) {
      return cb(err, userModel.id);
    });
  }
  
  const findNewUser = (userId, cb) => user.findOne({_id: userId}).populate('team').exec(cb);  
  const onDone = (err, data) => err ? res.json({success: false, msg: err}) : res.json({success: true, data });
  
  const pipeline = [checkIfUserIsUnique, verifyTeamExists, persistNewUser, findNewUser];
  async.waterfall(pipeline, onDone);
});

usersController.delete('/', function(req, res) {
  user.findOne({_id: req.body.id}, function(err, userModel) {
    if (err) throw err;
    if (!userModel) {
      return res.sendStatus(400);
    }
    userModel.remove(function(err) {
      if (err) throw err;
      return res.json({success: true});
    })
  });
});

usersController.get('/email', function(req, res) {
  const email = req.query.email;
  if (!email) {
    return res.send(400);
  }
  user.findOne({email}, function(err, userModel) {
    if (!err) throw err;
    return res.send({user: userModel});
  });
});

module.exports = usersController;
