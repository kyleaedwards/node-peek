'use strict';

/* Imports */
const repl = require('repl');

module.exports = function handleConnection(socket) {
  // On socket connection, create a new REPL instance
  // with the currently held options.
  const rpl = repl.start(Object.assign({
    prompt: 'repl > ',
    terminal: true,
    useGlobal: false,
    ignoreUndefined: true,
  }, this.options, {
    input: socket,
    output: socket,
  }));
  rpl.promptName = this.options.name || 'repl';

  // On socket connection, create a new REPL instance
  // with the currently held options.
  Object.keys(this.context).forEach((key) => {
    const val = this.context[key];
    rpl.context[key] = typeof val === 'function' ? val.bind(rpl.context) : val;
  });

  // Add existing registered commands.
  Object.keys(this.commands).forEach(cmd => rpl.defineCommand(cmd, this.commands[cmd]));

  // On exit, disconnect the REPL socket.
  rpl.on('exit', () => {
    socket.end();
    this.sockets = this.sockets.filter(s => s !== socket);
    this.repls = this.repls.filter(r => r !== rpl);
  });

  // Add the REPL and socket to the active sets.
  this.repls.push(rpl);
  this.sockets.push(socket);
};
