const { getConnection } = require('./connector');

const getChannel = cb => {
  getConnection((err, con) => {
    if (err) {
      return cb(err);
    }

    if (!con) {
      return cb('missing required connection');
    }

    con.createChannel(cb)
  })
};

module.exports = getChannel;
