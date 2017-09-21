const dbIndexMap = require('../cache/dbIndexMap');

const setDbIndex = (req, res, next) => {
  const { database } = req.query;
  req.dbIndex = dbIndexMap[database] || 0;
  next();
};

module.exports = setDbIndex;
