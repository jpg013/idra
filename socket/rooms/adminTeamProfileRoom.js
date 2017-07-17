const AuthClient  = require('../../common/authToken');
const async       = require('async');
const user        = require('../../models/userModel');
const SocketStore = require('../socketStore');
const ioEvents    = require('../ioEvents');
const SocketWrite = require('../socketWrite');

const onJoinRoom = (params={}) => {
  const { room, teamId, socket, authToken } = params;
  if (!room || !teamId || !socket || !authToken) return;
  if (room !== 'ADMIN_TEAM_PROFILE') return;
  
  AuthClient.verifyTokenAndReturnUser(authToken, (err, userModel) => {
    if (err) return;
    if (!userModel || !userModel.isAdmin) { return; }
    const opts = { userModel, teamId };
    SocketStore.joinRoom(room, opts);
  });
};

const onLeaveRoom = (params={}) => {
  const { room, socket, authToken } = params;
  if (!room || !socket || !authToken) {
    return;
  }
  if (room !== 'ADMIN_TEAM_PROFILE') {
    return;
  }
  AuthClient.verifyTokenAndReturnUser(authToken, (err, userModel) => {
    if (err) return;
    if (!userModel || !userModel.isAdmin) { return; }
    const opts = { userId: userModel.id };
    SocketStore.leaveRoom(room, opts);
  });
}

const onIntegrationUpdate = integrationModel => {
  if (!integrationModel) {
    return;
  }
    
  const roomConnections = SocketStore.getConnectedRoomSockets(
    'ADMIN_TEAM_PROFILE',
    {teamId: integrationModel.teamId}
  );
  if (!roomConnections) {
    return;
  }
    
  const payload = {
    type: 'INTEGRATION_UPDATE',
    teamId: integrationModel.teamId,
    data: integrationModel.clientProps
  };
  roomConnections.forEach(cur => SocketWrite(cur, ioEvents.notifyRoom, payload));
}

const config = socketEmitter => {
  socketEmitter.on(ioEvents.joinRoom, onJoinRoom);
  socketEmitter.on(ioEvents.leaveRoom, onLeaveRoom);
  socketEmitter.on(ioEvents.integrationUpdate, onIntegrationUpdate);
}

module.exports = {
  config
};
