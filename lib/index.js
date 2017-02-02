'use strict';

/* Imports */
const net = require('net');
const commands = require('./commands');
const handleConnection = require('./handle-connection');
const handleError = require('./handle-error');
const close = require('./close');
const defineCommand = require('./define-command');
const setContext = require('./set-context');
const setPrompt = require('./set-prompt');

module.exports = function Peek(sock) {
  const instance = {
    sockets: [],
    repls: [],
    context: {},
    options: {},
    commands,
  };
  instance.server = net
    .createServer(handleConnection.bind(instance))
    .listen(sock)
    .on('error', handleError(net, sock, instance));
  return {
    close: close.bind(instance),
    defineCommand: defineCommand.bind(instance),
    setContext: setContext.bind(instance),
    setPrompt: setPrompt.bind(instance),
  };
};
