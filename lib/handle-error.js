'use strict';

/* Imports */
const handleReconnect = require('./handle-reconnect');

module.exports = function handleErrorFactory(net, sock, instance) {
  return function handleError(e) {
    if (e.code !== 'EADDRINUSE') throw e;
    net.connect({ path: sock }, () => {
      instance.server.close();
      throw e;
    }).on('error', handleReconnect(sock, instance));
  };
};
