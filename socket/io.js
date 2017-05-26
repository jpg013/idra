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