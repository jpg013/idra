const openConnection = require('./openConnection');
const createChannel  = require('./createChannel');
const async          = require('async');

const consumeQueue = (q, channelOpts={}, cb) => {
  if (!q) {
    return;
  }

  const open = next => openConnection(next);
  const channel = (con, next) => createChannel(con, (err, ch) => next(err, con, ch));
  const consume = (con, ch, next) => {
    ch.consume('justinmq', cb)
  }

  async.waterfall([open, channel], consume);
};

module.exports = consumeQueue;
