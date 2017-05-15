const AdminTeamProfileRoom = require('./admin-team-profile-room.js');

const config = socketEmitter => {
  AdminTeamProfileRoom.config(socketEmitter);
}

module.exports = {
  config
};