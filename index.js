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
const repl = require('repl');
const commands = require('./lib/commands');

const repls = [];
const context = {};
let options = {};
let sockets = [];

net.createServer((socket) => {
  const r = repl.start(Object.assign({}, {
  	prompt: `repl > `,
  	terminal: true,
  	useGlobal: false,
  	ignoreUndefined: true,
  }, options, {
  	input: socket,
  	output: socket,
  }));
  if (context) {
    for (let k in context) {
      if (typeof context[k] === 'function') {
        r.context[k] = context[k].bind(r.context);
      } else {
        r.context[k] = context[k];
      }
    }
  }
  r.on('exit', function () {
  	socket.end();
    sockets = sockets.filter(s => s !== socket);
  });
  for (let cmd in commands) {
    r.defineCommand(cmd, commands[cmd]);
  }
  repls.push(repl);
  sockets.push(socket);
}).listen(9731);

/**
 * Closes the server and ends all REPL socket connections.
 */
function close() {
  sockets.forEach((socket) => {
	  socket.end();
  });
  this.server.close();
}

/**
 * Set variables in the REPL context.
 *
 * @param {String|Object}  key      Keyname or object containing K-V pairs
 * @param {Any}            [value]  Optional value if first param is a key
 */
function setContext(key, value) {
  if (key) {
    if (typeof key === 'object') {
      for (let k in key) {
        context[k] = key[k];
      }
    } else {
      context[key] = value;
    }
    repls.forEach((r) => {
      if (typeof key === 'object') {
        for (let k in key) {
          if (typeof key[k] === 'function') {
            r.context[k] = key[k].bind(r.context);
          } else {
            r.context[k] = key[k];
          }
        }
      } else {
        r.context[key] = value;
      }
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
  repls.forEach((r) => {
    r.defineCommand(cmd, action);
  });
  commands[cmd] = action;
}

/**
 * Sets the REPL prompt prefix.
 *
 * @param {String}          name    Prompt name
 */
function setPrompt(name) {
  options = Object.assign({}, options, {
    prompt: `${name} > `,
  });
  repls.forEach((r) => {
    r.setPrompt(options.prompt);
  });
}

// Globally expose REPL methods.
global.__replExists__ = true;
global.setREPLContext = setContext;
global.closeREPL = close;
global.setREPLPrompt = setPrompt;
global.defineREPLCommand = defineCommand;
