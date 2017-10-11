const openConnection  = require('./openConnection');
const closeConnection = require('./closeConnection');
const createChannel   = require('./createChannel');
const async           = require('async');

const sendToQueue = (q, msg, channelOpts={}) => {
  if (!q) {
    return;
  }

  const open = next => openConnection(next);
  const channel = (con, next) => createChannel(con, (err, ch) => next(err, con, ch));
  const send = (con, ch, next) => {
    ch.assertQueue('justinmq');
    
    try {
      //const strBuffer = Buffer.from(JSON.stringify(msg));
      ch.sendToQueue('justinmq', Buffer.from('hello world'));
      next(undefined, con);
    } catch(e) {
      next(e, con);
    } 
  }
  const onDone = (err, con) => closeConnection(con);

  async.waterfall([open, channel, send], onDone);
};

module.exports = sendToQueue;
