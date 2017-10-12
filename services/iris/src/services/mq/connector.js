const amqp = require('amqplib/callback_api');

// Stores the open connection
let _con;

const openConnection = cb => {
  amqp.connect(process.env.RABBITMQ_CONNECTION, function(err, conn) {
    if (err) {
      return cb(err);
    }

    if (!conn) {
      return cb('could not establish message queue connection');
    }
    _con = conn;
    return cb(err, conn);
  });
};

const closeConnection = con => con ? con.close() : undefined;

const getConnection = cb => {
  if (_con) {
    return cb(undefined, _con);
  }

  openConnection(cb);
}

module.exports = {
  getConnection,
  closeConnection
};
