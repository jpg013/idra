const async       = require('async');
const findUser    = require('../../services/users/findUser');
const addUser     = require('../../services/users/addUser');

const rootUserData = {
  username: 'innosol.admin',
  password: 'password',
  firstName: 'innosol',
  lastName: 'admin',
  passwordChangeRequired: false,
  roles: ['sysAdmin']
};

const addRootUser = cb => {
  findUser(rootUserData.username, (findErr, user) => {
    if (findErr) {
      return cb(findErr);
    }

    if (user) {
      return cb();
    }

    addUser(rootUserData, addErr => {
      return cb(addErr);
    });
  });
};

module.exports = addRootUser;
