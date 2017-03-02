const socketio = require('socket.io');
let io;

const config = server => {
  io = socketio.listen(server);
  io.on('connection', socket => {
    console.log('we have a connection');
    socket.on('restoreUser', data => {
      console.log(data);
    })
  })
}

module.exports = {
  config
}