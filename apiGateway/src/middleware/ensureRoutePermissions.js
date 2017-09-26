const getRequiredRoles = routes => {
  const allRoles = routes.reduce((acc, cur) => {
    return acc.concat(cur.authorizedRoles);
  }, []);
  
  return allRoles.filter((cur, pos) => allRoles.indexOf(cur) == pos);
}

const ensureRoutePermissions = (req, res, next) => {
  const { routes, user } = req;
  const requiredRoles = getRequiredRoles(routes);

  if (!requiredRoles || !requiredRoles.length) {
    return next();
  }

  if (!user) {
    return next();
  }

  const missingRole = requiredRoles.find(cur => user.indexOf(cur) < 0);
  
  if (missingRole) {
    // Send 403 forbidden
    return resp.status(403).send({msg: 'User is unauthorized.'});
  }
  
  return next();
}

module.exports = ensureRoutePermissions;