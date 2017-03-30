const jwt          = require('jsonwebtoken');
const usersService = require('../services/users.service');

const verifyToken              = (tokenString, cb) => jwt.verify(tokenString, process.env.AUTH_TOKEN_SECRET, cb);
const signToken                = (data, expiresIn) => jwt.sign(data, process.env.AUTH_TOKEN_SECRET, { expiresIn });
const verifyTokenAndReturnUser = (tokenString, cb) => {
  verifyToken(tokenString, (err, tokenData) => {
    if (err) {
      return cb(err);
    } 
    usersService.findUser({_id: tokenData.id}, cb);
  });  
}

module.exports = {
  verifyToken,
  signToken,
  verifyTokenAndReturnUser
};