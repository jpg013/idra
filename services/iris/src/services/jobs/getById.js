const findById = require('../../db/jobs/findById');
const mapClientProps = require('../../db/jobs/mapClientProps');

const getById = (id, cb) => {
  findById(id, (err, job) => {
    if (err || !job) {
      return cb(err);
    }

    return cb(err, mapClientProps(job));
  });
};

module.exports = getById;
