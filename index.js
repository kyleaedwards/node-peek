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

let options = {
  prompt: `repl > `,
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
    const r = repl.start(Object.assign({}, options, {
      input: socket,
      output: socket,
    }));
    r._name = options.name || 'repl';

    // On socket connection, create a new REPL instance
    // with the currently held options.
    Object.keys(context).forEach((key) => {
      const val = context[key];
      r.context[key] = typeof val === 'function' ? val.bind(r.context) : val;
    });

    // Add existing registered commands.
    Object.keys(commands).forEach(cmd => r.defineCommand(cmd, commands[cmd]));

    // On exit, disconnect the REPL socket.
    r.on('exit', () => {
      socket.end();
      sockets = sockets.filter(s => s !== socket);
      repls = repls.filter(repl => repl !== r);
    });

    // Add the REPL and socket to the active sets.
    repls.push(repl);
    sockets.push(socket);
  }).listen(sock);

  // Unlink an existing Unix socket if it exists.
  server.on('error', (e) => {
    if (e.code !== 'EADDRINUSE') throw e;
    net.connect({ path: sock }, () => {
      process.stdout.write('REPL socket already in use. Exiting.\n');
      server.close();
      process.exit(1);
    }).on('error', (e) => {
      if (e.code !== 'ECONNREFUSED') throw e;
      fs.unlinkSync(sock);
      server.listen(sock);
    });
  });

  /**
   * Closes the server and ends all REPL socket connections.
   */
  function close() {
    sockets.forEach(socket => socket.end());
    repls.forEach(repl => repl.end());
    sockets = [];
    repls = [];
    server.close();
  }

  /**
   * Set variables in the REPL context.
   *
   * @param {String|Object}  key      Keyname or object containing K-V pairs
   * @param {Any}            [value]  Optional value if first param is a key
   */
  function setContext(key, value) {
    if (key) {
      const newCtx = typeof key !== 'object' ? {[key]: value} : key;
      Object.assign(context, newCtx);
      repls.forEach((r) => {
        Object.keys(newCtx).forEach((key) => {
          const val = newCtx[key];
          r.context[key] = typeof val === 'function' ? val.bind(r.context) : val;
        });
      });
    }
  }

  /**
   * Defines a command all active and future REPLs. Uses the same API
   * as the native node repl module.
   *
   * @param {String}          cmd     Command key
   * @param {Object|Function} action  Object/function describing REPL action
   */
  function defineCommand(cmd, action) {
    repls.forEach(r => r.defineCommand(cmd, action));
    commands[cmd] = action;
  }

  /**
   * Sets the REPL prompt prefix.
   *
   * @param {String}          name    Prompt name
   */
  function setPrompt(name) {
    options.prompt = `${name} > `;
    options.name = name;
    repls.forEach((r) => {
      r._name = name;
      r.setPrompt(options.prompt);
    });
  }

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
