const express         = require('express')
const cryptoClient    = require('../common/crypto');
const usersController = express.Router();
const authMiddleware  = require('../middleware/auth');
const usersService    = require('../services/users.service');

const deleteUserErrorMsg = 'There was an error deleting the user';

const getUsers = (req, res) => {
  usersService.queryUsers({}, function(err, users) {
    if (err) throw err;
    res.json({data: users.map(cur => cur.clientProps)});
  })
}

const addUser = (req, res) => {
  const { email, firstName, lastName, teamId, role, password } = req.body;
  const userData = { email, firstName, lastName, teamId, role, password };

  if (!users.service.validateUserForm(userData)) {
    return res.json({success: false, msg: 'Invalid form data'});
  }
  
  const onUserCreated = (err, createdUser) => {
    if (err) {
      return res.json({success: false, msg: err});
    }
    return res.json({success: true, data: createdUser });
  }
  
  usersService.createUser(userData, onUserCreated);
}

const deleteUser = (req, res) => {
  const {id} = req.body;
  if (!id) {
    return res.status(400).send({msg: deleteUserErrorMsg});
  }
  usersService.deleteUser(id, function(err, deleteUser) {
    if (!removedTeam) {
      return res.json({success: false});
    }
    return res.json({success: true, deletedId: deleteUser.id});
  }); 
}

const updateUser = (req, res) => {
  const {firstName, lastName, role, password, id} = req.body;
  if (!id) {
    return res.status(400).send({msg: 'Missing required user id'});
  }
  const userData = {firstName, lastName, role, password, id};

  usersService.editUser(userData, function(err, editedUser) {
    if (err) {
      return res.json({success: false, msg: err})
    }
    return res.json({success: true, data: editedUser})
  })
}

/**
 * Controller Routes
 */
usersController.get('/', authMiddleware.isAdmin, getUsers);
usersController.post('/', authMiddleware.isAdmin, addUser);
usersController.delete('/', authMiddleware.isAdmin, deleteUser);
usersController.put('/', authMiddleware.isAdmin, updateUser);

module.exports = usersController;
