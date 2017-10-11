const closeConnection = con => con ? con.close() : undefined;

module.exports = closeConnection;