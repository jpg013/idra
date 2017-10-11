const createChannel = (con, cb) => {
  if (!con) {
    return cb('missing required connection');
  }
  con.createChannel(cb);
  //const common_options = { durable: true, noAck: true};
  // /ch.assertQueue(q, common_options);
};

module.exports = createChannel;