const encrypt = require('../../../helpers/encrypt')

const rootUserData = {
  userName: 'innosol.admin',
  password: encrypt('password'),
  firstName: 'innosol',
  lastName: 'admin',
  email: 'jpg013@gmail.com',
  passwordChangeRequired: false,
  roles: ['sysAdmin'],
  createdDate: new Date()
};


const addRootUser = (db, cb) => {
  const userCollection = db.collection('users');

  const $insert = { rootUserData }

  userCollection.updateOne({username: rootUserData.username}, rootUserData, {upsert: true, w: 1}, (err, result) => {
    if (err) {
      return cb(insertErr);
    }
    if (result.insertedCount !== 1) {
      return cb('There was an error adding the root user.');
    }
    cb();
  });
};

module.exports = addRootUser;
