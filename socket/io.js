const EventEmitter    = require('events');
const SocketUser      = require('./socketUser');
const SocketRooms     = require('./rooms/index');
const SocketEvents    = require('./ioEvents')

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

function handleIntegrationUpdate(integrationModel) {
  if (!integrationModel) {
    return; 
  }
  emitSocketEvent(SocketEvents.integrationUpdate, integrationModel);
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
  handleIntegrationUpdate,
  handleCreateReport,
  handleSyncUser
};
