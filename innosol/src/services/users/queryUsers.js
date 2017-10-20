const db = require('../../db/connector');

const queryUsers = ($query, opts, cb) => {
  const { $sort, $limit, $skip, $project } = opts;
  const dbConn = db.getConnection();
  const userCollection = dbConn.collection('users');
  
  const cursor = userCollection.find($query);
  
  if ($sort) {
    cursor.sort($sort);
  }
  
  if ($skip) {
    cursor.skip($skip);
  }
  
  if ($limit) {
    cursor.limit($limit);
  }
  
  if ($project) {
    cursor.project($project);
  }
  
  const onQueryResults = (err, results) => {
    if (err) {
      return cb(err);
    }
    
    if (!results.length) {
      return cb(err);
    }
    
    cb(err, results[0]);
  };
  
  cursor.toArray(onQueryResults);
};


module.exports = queryUsers;
