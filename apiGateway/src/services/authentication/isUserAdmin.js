const isAdmin = (req, res, next) => {
  User.findOne({_id: req.authTokenData.id}, function(err, userModel) {
    if (err) throw err;
    
    if (!userModel) {
      return res.status(401).send({
        success: false,
        message: 'User does not exists'
      });
    }
      
    if (!userModel.isAdmin) {
      return res.status(403).send({
        success: false,
        message: 'User does not have admin privileges.'
      });
    }
    req.adminUser = userModel;
    next();
  });
};
