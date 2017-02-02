'use strict';

/**
 * Closes the server and ends all REPL socket connections.
 */
module.exports = function close() {
  this.sockets.forEach(socket => socket.end());
  this.repls.forEach(r => r.close());
  this.sockets = [];
  this.repls = [];
  this.server.close();
};
