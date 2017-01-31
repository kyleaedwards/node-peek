#!/usr/bin/env node

'use strict';

/* Imports */
const net = require('net');

/* Constants */
const sock = net.connect('repl.sock');

process.stdin.pipe(sock);
sock.pipe(process.stdout);

sock.on('connect', function () {
  process.stdin.resume();
  process.stdin.setRawMode(true);
});

sock.on('close', function done() {
  process.stdin.setRawMode(false);
  process.stdin.pause();
  sock.removeListener('close', done);
  process.exit();
});

process.stdin.on('end', function () {
  sock.destroy();
  process.stdout.write('\n');
  process.exit();
});

process.stdin.on('data', function (b) {
  if (b.length === 1 && b[0] === 4) {
    process.stdin.emit('end');
  }
});
