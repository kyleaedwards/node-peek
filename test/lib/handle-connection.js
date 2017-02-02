'use strict';

/* Imports */
const net = require('net');
const assert = require('assert');
const handleConnection = require('../../lib/handle-connection');

describe('handleConnection()', () => {
  let server;
  let port;
  before((done) => {
    server = net.createServer(() => {}).listen(0, () => {
      port = server.address().port;
      done();
    });
  });
  after(done => server.close(done));
  it('should accept a handle and create a repl', (done) => {
    let testCommandRun = false;
    let ctxFuncBound = false;
    const socket = new net.Socket({
      readable: true,
      writable: true,
    }).on('end', done);
    socket.connect(port, () => {
      const instance = {
        commands: {
          test: {
            help: 'Test command.',
            action() {
              testCommandRun = true;
            },
          },
        },
        options: {},
        context: {
          test: 'value',
          func() {
            ctxFuncBound = this === instance.repls[0].context;
          },
        },
        repls: [],
        sockets: [],
      };
      handleConnection.call(instance, socket);
      assert.strictEqual(instance.repls.length, 1);
      assert.strictEqual(instance.sockets.length, 1);
      assert.strictEqual(instance.repls[0].context.test, 'value');
      assert.ok(instance.repls[0].commands.test);
      assert.strictEqual(typeof instance.repls[0].commands.test.action, 'function');
      instance.repls[0].commands.test.action();
      instance.repls[0].context.func();
      assert.strictEqual(testCommandRun, true);
      assert.strictEqual(ctxFuncBound, true);
      instance.repls[0].close();
    });
  });
});
