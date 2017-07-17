const AdminTeamProfileRoom = require('./adminTeamProfileRoom.js');

const config = socketEmitter => {
  AdminTeamProfileRoom.config(socketEmitter);
}

module.exports = {
  config
};
