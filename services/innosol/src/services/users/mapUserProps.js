const mapUserProps = fields => {
  if (!fields) {
    return;
  }  

  const {
    un: username,
    pw: password,
    fn: firstName,
    ln: lastName,
    pcr: passwordChangeRequired,
    rs: roles,
    cd: createdDate,
    lld: lastLoginDate
  } = fields;

  return {
    username,
    password,
    firstName,
    lastName,
    passwordChangeRequired,
    roles,
    createdDate,
    lastLoginDate
  };
};

module.exports = mapUserProps;