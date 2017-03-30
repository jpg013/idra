const immutable = require('immutable');

/**
 * Factory returns object that exposes connectionMap and userConnection map
 */
const buildConnectionStore = () => {
  let connectionMap = immutable.Map();
  let userConnectionMap = immutable.Map();
  let rooms = immutable.Map();

  const roomRestrictions = immutable.Map({"admin": [user => user.isAdmin]});

  const canUserJoinRoom = (room, userModel) => {
    const restrictions = roomRestrictions.get(room);
    if (!restrictions) return true;
    const failed = restrictions.filter(fn => !fn(userModel));
    return failed.length === 0;
  }

  const addConnection = conn => {
    if (!conn) { return; }
    connectionMap = connectionMap.set(conn.id, conn);
  }

  const identifyConnection = (userId, connId) => {
    if (!connectionMap.get(connId)) { return; }
    userConnectionMap = userConnectionMap.set(userId, connId);
  }

  const removeConnection = connId => {
    connectionMap = connectionMap.delete(connId);
    userConnectionMap = connectionMap.delete(connId);
  }

  const getClientSocket = userId => {
    if (!userId) { return; }
    const connId = userConnectionMap.get(userId);
    return connId ? connectionMap.get(connId) : undefined;
  }

  const getConnectedClientList = () => {
    return userConnectionMap.keySeq().toJS();
  }

  const joinRoom = (roomName, user) => {
    if (!roomName || !user) { return; }
    if (!canUserJoinRoom(roomName, user)) { return; }
    if (!rooms.get(roomName)) {
      rooms = rooms.set(roomName, immutable.Set.of(user.id));
    } else {
      rooms = rooms.update(roomName, val => val.contains(user.id) ? val : val.add(user.id));
    }
  }

  const getConnectedRoomSockets = (roomName) => {
    if (!roomName) return;
    const roomUserIds = rooms.get(roomName);
    if (!roomUserIds) return;

    // Map the user ids to connected clients
    return roomUserIds
      .toList()
      .map(cur => getClientSocket(cur))
      .filter(cur => !!cur);
  }

  const leaveRoom = (roomName, user) => {

  }

  return {
    addConnection,
    identifyConnection,
    removeConnection,
    joinRoom,
    getClientSocket,
    getConnectedClientList,
    getConnectedRoomSockets
  }
}

/**
 * Get store instance
 */
module.exports = buildConnectionStore();