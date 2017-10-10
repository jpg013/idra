const findOne = require('../../db/institutions/findOne');
const mapClientProps = require('../../db/institutions/mapClientProps');

const getByName = (name, cb) => {
  const $query = { name };

  findOne($query, (err, institution) => {
    if (err || !institution) {
      return cb(err);
    }

    return cb(err, mapClientProps(institution));
  });
};

module.exports = getByName;
