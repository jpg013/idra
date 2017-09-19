const encrypt = require('../../helpers/encrypt');

const makeUserInsert = userData => {
  const { 
    username,
    password,
    firstName,
    lastName,
    passwordChangeRequired,
    roles
  } = userData;

  return {
    un: username,
    pw: encrypt(password),
    fn: firstName,
    ln: lastName,
    pcr: passwordChangeRequired,
    rs: roles,
    cd: new Date(),
    lld: undefined
  }
};

module.exports = makeUserInsert;