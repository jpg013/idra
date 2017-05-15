function socketWrite(conn, event, payload) {
  if (!conn || !event) return;
  const msg = { event, payload };
  conn.write(JSON.stringify(msg));    
}

module.exports = socketWrite;