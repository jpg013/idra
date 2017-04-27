const User         = require('../models/user.model');
const CryptoClient = require('../common/crypto');

const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const isValidEmail = email => emailRegex.test(email);
const isValidUserPassword = password => password.trim().length >= 8;


function validateUserFields(fields) {
  if (!fields || typeof fields !== 'object') return false;
  
  if (!fields.firstName || 
      !fields.lastName || 
      !isValidEmail(fields.email) || 
      !fields.password || 
      !isValidUserPassword(fields.password) ||
      !fields.team
      ) { return false; }
  return true;
}

function scrubUserData(data) {
  if (!data || typeof data !== 'object') return {};
  const { email, firstName, lastName, password, team, role } = data;
  return {
    email,
    firstName,
    lastName,
    password: CryptoClient.encrypt(password),
    team,
    role
  };
}

const buildUserModel = userFields => {
  const modelProps = Object.assign({}, userFields, {
    passwordChangeRequired: true
  });
  return new User(modelProps);
}

module.exports = {
  buildUserModel,
  isValidUserPassword,
  scrubUserData,
  validateUserFields
}