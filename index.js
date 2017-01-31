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
const net = require('net');
const fs = require('fs');
const repl = require('repl');
const commands = require('./lib/commands');

/* Constants */
const sock = 'repl.sock';
const useREPL = !!process.argv.slice(2).filter(n => n === '--repl').length;
const context = {};
const noop = () => {};
const options = {
  prompt: 'repl > ',
  terminal: true,
  useGlobal: false,
  ignoreUndefined: true,
};

let sockets = [];
let repls = [];

if (useREPL) {
  const server = net.createServer((socket) => {
    // On socket connection, create a new REPL instance
    // with the currently held options.
    const rpl = repl.start(Object.assign({}, options, {
      input: socket,
      output: socket,
    }));
    rpl.promptName = options.name || 'repl';

    // On socket connection, create a new REPL instance
    // with the currently held options.
    Object.keys(context).forEach((key) => {
      const val = context[key];
      rpl.context[key] = typeof val === 'function' ? val.bind(rpl.context) : val;
    });

    // Add existing registered commands.
    Object.keys(commands).forEach(cmd => rpl.defineCommand(cmd, commands[cmd]));

    // On exit, disconnect the REPL socket.
    rpl.on('exit', () => {
      socket.end();
      sockets = sockets.filter(s => s !== socket);
      repls = repls.filter(r => r !== rpl);
    });

    // Add the REPL and socket to the active sets.
    repls.push(rpl);
    sockets.push(socket);
  }).listen(sock);

  // Unlink an existing Unix socket if it exists.
  server.on('error', (eOut) => {
    if (eOut.code !== 'EADDRINUSE') throw eOut;
    net.connect({ path: sock }, () => {
      process.stdout.write('REPL socket already in use. Exiting.\n');
      server.close();
      process.exit(1);
    }).on('error', (eIn) => {
      if (eIn.code !== 'ECONNREFUSED') throw eIn;
      fs.unlinkSync(sock);
      server.listen(sock);
    });
  });

  /**
   * Closes the server and ends all REPL socket connections.
   */
  const close = function close() {
    sockets.forEach(socket => socket.end());
    repls.forEach(r => r.end());
    sockets = [];
    repls = [];
    server.close();
  };

  /**
   * Set variables in the REPL context.
   *
   * @param {String|Object}  key      Keyname or object containing K-V pairs
   * @param {Any}            [value]  Optional value if first param is a key
   */
  const setContext = function setContext(key, value) {
    if (key) {
      const newCtx = typeof key !== 'object' ? { [key]: value } : key;
      Object.assign(context, newCtx);
      repls.forEach((r) => {
        Object.keys(newCtx).forEach((k) => {
          const val = newCtx[k];
          r.context[k] = typeof val === 'function' ? val.bind(r.context) : val;
        });
      });
    }
  };

  /**
   * Defines a command all active and future REPLs. Uses the same API
   * as the native node repl module.
   *
   * @param {String}          cmd     Command key
   * @param {Object|Function} action  Object/function describing REPL action
   */
  const defineCommand = function defineCommand(cmd, action) {
    repls.forEach(r => r.defineCommand(cmd, action));
    commands[cmd] = action;
  };

  /**
   * Sets the REPL prompt prefix.
   *
   * @param {String}          name    Prompt name
   */
  const setPrompt = function setPrompt(name) {
    options.prompt = `${name} > `;
    options.name = name;
    repls.forEach((r) => {
      r.promptName = name;
      r.setPrompt(options.prompt);
    });
  };

  module.exports = {
    setContext,
    close,
    setPrompt,
    defineCommand,
  };
} else {
  module.exports = {
    setContext: noop,
    close: noop,
    setPrompt: noop,
    defineCommand: noop,
  };
}
