const sockjs       = require("sockjs");
const store        = require('./sock-store');
const sockEvents   = require('./sock-events');
const io           = require('./io');

/**
 * Private variable to hold the socket connection
 */
let sock;

const config = server => {
  sock = sockjs.createServer({ sockjs_url: process.env.SOCK_URL });
  
  sock.on('connection', function(socket) {
    store.addConnection(socket);

    const onSocketMsg = msg => {
      if (!msg) { return; }
      msg = JSON.parse(msg);
      sockEvents.emit(msg.event, {
        payload: msg.payload,
        socket: socket
      });
    };

    const onSocketClose = () => store.removeConnection(socket.id);

    socket.on('data', onSocketMsg);
    socket.on('close', onSocketClose);
  });
  
  /**
   * Config our io handlers
   */
  io.config();
  
  /**
   * Lastly, install the handlers and call config on the io handlers
   */
  sock.installHandlers(server, {prefix: '/_sock'});
};

module.exports = {
  config
};
