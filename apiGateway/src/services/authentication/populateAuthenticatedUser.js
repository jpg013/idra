const populateAuthenticatedUser = (req, res, next) => {
  const { bearerTokenPayload } = req;
  
  if (!bearerTokenPayload) {
    return next();
  }
  
};

module.exports = populateAuthenticatedUser;
