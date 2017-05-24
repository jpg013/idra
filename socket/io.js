const EventEmitter    = require('events');
const SocketUser      = require('./socket-user');
const SocketRooms     = require('./rooms/index');
const SocketEvents    = require('./io-events')

/**
 * Socket emitter instance
 */
const socketEmitter = new EventEmitter();

function emitSocketEvent(event, payload) {
  if (!event || !payload) return;
  socketEmitter.emit(event, payload);
};

/*
function onNotifyRoom(eData) {
  const {room, action, data} = eData;
  if (!room || !action || !data) return;
  const roomSocks = sockStore.getConnectedRoomSockets(room);
  if (!roomSocks) return;

  const sockPayload = { room, action, data };
  roomSocks.forEach(cur => writeToSocket(cur, sockEvents.e.notifyRoom, sockPayload));
}
*/

function config() {
  SocketUser.config(socketEmitter);
  SocketRooms.config(socketEmitter);
};

function handleClientMessage(event, params={}) {
  emitSocketEvent(event, params);
}

function handleTwitterIntegrationUpdate(twitterIntegrationModel) {
  if (!twitterIntegrationModel) return;
  emitSocketEvent(SocketEvents.twitterIntegrationUpdate, twitterIntegrationModel);
}

function handleCreateReport(reportModel) {
  if (!reportModel) return;
  emitSocketEvent(SocketEvents.createReport, reportModel);
}

function handleSyncUser(userModel) {
  if (!userModel) return;
  emitSocketEvent(SocketEvents.syncUser, userModel);
}

module.exports = {
  config,
  handleClientMessage,
  handleTwitterIntegrationUpdate,
  handleCreateReport,
  handleSyncUser
};