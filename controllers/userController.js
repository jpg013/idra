const express         = require('express');
const UsersController = express.Router();
const AuthMiddleware  = require('../middleware/auth');
const UserService     = require('../services/userService');

/**
 *  Error Messages
 */
const deleteUserErrorMsg = 'There was an error deleting the user';

const getUsers = (req, res) => {
  UserService.getUserList(function(err, results) {
    if (err) {
      return res.status(500).send({});
    }
    return res.status(200).send({results});
  });
};

const createUser = (req, res) => {
  const onUserCreated = (err, createdUser) => {
    return err ?
      res.status(200).send({success: false, msg: err}) :
      res.status(200).send({success: true, data: createdUser});
  };
  UserService.createUser(req.body, onUserCreated);
};

const deleteUser = (req, res) => {
  const {id} = req.body;
  if (!id) {
    return res.status(400).send({msg: deleteUserErrorMsg});
  }
  UserService.deleteUser(id, function(err, deleteUser) {
    if (!removedTeam) {
      return res.json({success: false});
    }
    return res.json({success: true, deletedId: deleteUser.id});
  });
};

const updateUser = (req, res) => {
  
};

/**
 * Controller Routes
 */
UsersController.get('/', AuthMiddleware.isAdmin, getUsers);
UsersController.post('/', AuthMiddleware.isAdmin, createUser);
UsersController.delete('/', AuthMiddleware.isAdmin, deleteUser);
UsersController.put('/', AuthMiddleware.isAdmin, updateUser);

module.exports = UsersController;
