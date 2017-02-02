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
const log = require('./log');

module.exports = function PeekFactory(sock) {
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
  const peek = setContext.bind(instance);
  peek.close = close.bind(instance);
  peek.defineCommand = defineCommand.bind(instance);
  peek.setPrompt = setPrompt.bind(instance);
  peek.log = log.bind(instance);
  return peek;
};
