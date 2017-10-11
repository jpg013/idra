const amqp = require('amqplib/callback_api');

const openConnection = cb => {
  amqp.connect(process.env.RABBITMQ_CONNECTION, function(err, conn) {
    if (err) {
      return cb(err);
    }

    if (!conn) {
      return cb('could not establish message queue connection');
    }

    return cb(err, conn);
  });
}

module.exports = openConnection;