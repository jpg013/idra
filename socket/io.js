const authTokenClient = require("../common/auth-token");
const user            = require("../models/user.model.js");
const immutable       = require("immutable");
const async           = require("async");
const sockStore       = require('./sock-store');
const sockEvents      = require('./sock-events');
const rooms           = require('./rooms/index');
const UserService    = require('../services/user.service');

const onIdentifyConnection = (payload) => {
  const { authToken, socket } = payload;
  if (!authToken || !socket) return;
  const pipeline = [
    cb => authTokenClient.verifyToken(authToken, cb),
    (token, cb) => {
      UserService.findUser(token.id, cb);
    },
    (userModel, cb) => {
      if (!userModel) return cb('missing required user model');
      sockStore.identifyConnection(userModel.id, socket.id);
      UserService.updateUserModel(userModel.id, {'lastLoginDate': new Date()}, cb);
    }
  ];
  
  async.waterfall(pipeline, (err, userModel) => {
    if (err || !userModel) { return; }
    sockEvents.emit(sockEvents.e.syncUser, userModel);
  });
};

const onSyncUser = userModel => {
  if (!userModel) { return; }
  const conn = sockStore.getClientSocket(userModel.id);
  if (!conn) { return; }
  
  const msg = {
    event: sockEvents.e.syncUser,
    payload: userModel.clientProps
  };
  conn.write(JSON.stringify(msg));  
};

const joinAdminRoom = (userModel, socket) => {
  if (!userModel.isAdmin) { return; }
  sockStore.joinRoom('admin', userModel);
  const connectedSockets = sockStore.getConnectedClientList();

  user.find({_id: {$in: connectedSockets}}, function(err, connectedAdminClients) {
    if (err) { return; }
    const msg = {
      event: sockEvents.e.notifyRoom,
      payload: {
        room: 'admin',
        action: 'CONNECTED_CLIENTS',
        data: connectedAdminClients.map(cur => cur.clientProps)
      }
    };
    socket.write(JSON.stringify(msg));    
  });  
};

const onNotifyRoom = (eData) => {
  const {room, action, data} = eData;
  if (!room || !action || !data) return;
  const roomSocks = sockStore.getConnectedRoomSockets(room);
  if (!roomSocks) return;

  const sockPayload = { room, action, data };
  roomSocks.forEach(cur => writeToSocket(cur, sockEvents.e.notifyRoom, sockPayload));
}

const writeToSocket = (socket, event, payload) => {
  if (!socket || !event) return;
  const msg = {
    event,
    payload
  };
  socket.write(JSON.stringify(msg));    
}

const onJoinRoom = (data) => {
  const { authToken, socket, room } = data;
  if (!authToken || !socket || !room) { return; }
  authTokenClient.verifyTokenAndReturnUser(authToken, function(err, userModel) {
    if (!userModel) return;
    switch(room) {
      case 'admin':
        return joinAdminRoom(userModel, socket);
      default: 
        return;
    }
  });
};

const config = () => {
  sockEvents.attachEventListener(sockEvents.e.identifyConnection, onIdentifyConnection);
  sockEvents.attachEventListener(sockEvents.e.syncUser, onSyncUser);
  sockEvents.attachEventListener(sockEvents.e.joinRoom, onJoinRoom);
  sockEvents.attachEventListener(sockEvents.e.notifyRoom, onNotifyRoom);
};

module.exports = {
  config
};