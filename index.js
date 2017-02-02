'use strict';

/*!
 * node-peek
 * REPL add-on for debugging and benchmarking Node applications.
 *
 * Copyright(c) 2017 Kyle Edwards <edwards.kyle.a@gmail.com>
 * MIT Licensed
 *
 * Credit to:
 * - https://gist.github.com/TooTallNate/2209310
 * - https://github.com/martinj/node-net-repl
 */

/* Imports */
const Peek = require('./lib');
const noop = require('./lib/utils/noop');

/* Constants */
const sock = 'repl.sock';
const replFlag = !!process.argv.slice(2).filter(n => n === '--repl').length;
const replEnv = process.env.REPL === 'true';

if (replFlag || replEnv) {
  module.exports = Peek(sock);
} else {
  module.exports = {
    setContext: noop,
    close: noop,
    setPrompt: noop,
    defineCommand: noop,
  };
}
