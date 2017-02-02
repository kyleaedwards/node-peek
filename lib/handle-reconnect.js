'use strict';

/* Imports */
const fs = require('fs');

module.exports = function handleReconnectFactory(sock, instance) {
  return function handleReconnect(e) {
    if (e.code !== 'ECONNREFUSED') throw e;
    fs.unlinkSync(sock);
    instance.server.listen(sock);
  };
};
