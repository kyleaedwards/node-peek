'use strict';

/* Imports */
const assert = require('assert');
const handleError = require('../../lib/handle-error');

describe('handleError()', () => {
  it('should attempt to connect to existing server and throw if it works', () => {
    const e = { code: 'EADDRINUSE' };
    const file = `/tmp/handle-reconnect-test.${Date.now()}`;
    const net = {
      connect(sock, cb) {
        assert.ok(sock);
        assert.strictEqual(sock.path, file);
        assert.strictEqual(typeof cb, 'function');
        cb();
        return net;
      },
      on: () => {
        assert.ok(false); // Should not get this far.
      },
    };
    let serverClosed = false;
    assert.throws(() => {
      handleError(net, file, {
        server: {
          close: () => {
            serverClosed = true;
          },
        },
      })(e);
    });
    assert.strictEqual(serverClosed, true);
  });
  it('should pass along to error cb if net.connect fails', () => {
    const e = { code: 'EADDRINUSE' };
    const file = `/tmp/handle-reconnect-test.${Date.now()}`;
    const net = {
      connect: () => net,
      on: (label, cb) => {
        assert.strictEqual(label, 'error');
        assert.strictEqual(typeof cb, 'function');
      },
    };
    handleError(net, file, {})(e);
  });
  it('should throw if EADDRINUSE error is not passed', () => {
    const e = { code: 'ECONNREFUSED' };
    assert.throws(() => handleError('', {})(e));
  });
});
