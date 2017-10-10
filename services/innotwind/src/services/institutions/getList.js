const find = require('../../db/institutions/find');
const mapClientProps = require('../../db/institutions/mapClientProps');

const getList = cb => {
  const $query = {};
  
  find($query, (err, results=[]) => {
    if (err) {
      return cb(err);
    }
    return cb(err, results.map(mapClientProps))
  });
};

module.exports = getList;
