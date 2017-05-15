const sockjs      = require("sockjs");
const SocketStore = require('./socket-store');
const io          = require('./io');

/**
 * Private variable to hold the socket connection
 */
let sock;

const handleSocketConnection = socket => {
  SocketStore.addConnection(socket);

  const onSocketMsg = msg => {
    if (!msg) { return; }
    msg = JSON.parse(msg);
    io.handleClientMessage(msg.event, Object.assign({}, msg.payload, {socket}));
  };

  const onSocketClose = () => SocketStore.removeConnection(socket.id);

  socket.on('data', onSocketMsg);
  socket.on('close', onSocketClose);
}

const config = server => {
  sock = sockjs.createServer({ sockjs_url: process.env.SOCK_URL });
  
  sock.on('connection', handleSocketConnection);
  
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
