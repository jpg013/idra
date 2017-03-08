const jwt  = require('jsonwebtoken');
const user = require('../models/user.model');

const verifyToken              = (tokenString, cb) => jwt.verify(tokenString, process.env.AUTH_TOKEN_SECRET, cb);
const signToken                = (data, expiresIn) => jwt.sign(data, process.env.AUTH_TOKEN_SECRET, { expiresIn });
const verifyTokenAndReturnUser = (tokenString, cb) => verifyToken(tokenString, (err, token) => {return err ? cb(err) : user.findOne({_id: token._doc._id}, cb)}); 

module.exports = {
  verifyToken,
  signToken,
  verifyTokenAndReturnUser
};