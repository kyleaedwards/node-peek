'use strict';

/* Imports */
const assert = require('assert');
const close = require('../../lib/close');

describe('close()', () => {
  it('should close all sockets and repls', (done) => {
    let endCalls = 0;
    const instance = {
      sockets: [{ end: () => { endCalls += 1; } }],
      repls: [{ close: () => { endCalls += 1; } }],
      server: {
        close: () => {
          assert.strictEqual(instance.sockets.length, 0);
          assert.strictEqual(instance.repls.length, 0);
          assert.strictEqual(endCalls, 2);
          done();
        },
      },
    };
    close.call(instance);
  });
});
