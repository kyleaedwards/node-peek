'use strict';

/* Imports */
const util = require('util');

/**
 * Logs to all REPLs.
 */
module.exports = function log() {
  this.repls.forEach((r) => {
    r.outputStream.write(`${util.format.apply(this, arguments)}\n`);
  });
};
