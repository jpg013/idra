const findById = require('../../db/institutions/findById');
const mapClientProps = require('../../db/institutions/mapClientProps');

const getById = (id, cb) => {
  findById(id, (err, institution) => {
    if (err || !institution) {
      return cb(err);
    }

    return cb(err, mapClientProps(institution));
  });
};

module.exports = getById;
