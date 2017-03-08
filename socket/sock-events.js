const EventEmitter = require('events');

/**
 * IO Events
 */
const sockEvents = {
  connect: "SOCKET_CONNECT",
  identifyConnection: "SOCKET_IDENTIFY_CONNECTION",
  syncUser: "SOCKET_SYNC_USER",
  joinRoom: "SOCKET_JOIN_ROOM",
  leaveRoom: "SOCKET_LEAVE_ROOM",
  notifyRoom: "SOCKET_ROOM_NOTIFICATION"
};

/**
 * Socket emitter instance
 */
const socketEmitter = new EventEmitter();

const attachEventListener = (event, cb) => {
  socketEmitter.on(event, cb);
};

const removeEventListener = (event, cb) => {
  socketEmitter.removeListener(event, cb);
};

const emit = (event, data) => {
  socketEmitter.emit(event, data);
};

module.exports = {
  emit,
  attachEventListener,
  removeEventListener,
  e: sockEvents
};

