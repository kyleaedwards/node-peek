'use strict';

/* Imports */
const assert = require('assert');
const fs = require('fs');
const handleReconnect = require('../../lib/handle-reconnect');

describe('handleReconnect()', () => {
  it('should attempt to delete socket and reconnect to server', (done) => {
    const e = { code: 'ECONNREFUSED' };
    const file = `/tmp/handle-reconnect-test.${Date.now()}`;
    fs.closeSync(fs.openSync(file, 'w'));
    handleReconnect(file, {
      server: {
        listen: (sock) => {
          assert.strictEqual(file, sock);
          assert.strictEqual(fs.existsSync(file), false);
          done();
        },
      },
    })(e);
  });
  it('should throw if connection error is not passed', () => {
    const e = { code: 'EADDRINUSE' };
    assert.throws(() => handleReconnect('', {})(e));
  });
});
