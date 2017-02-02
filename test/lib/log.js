'use strict';

/* Imports */
const assert = require('assert');
const log = require('../../lib/log');

describe('log()', () => {
  it('should add cmd to existing repls and store', () => {
    let calls = 0;
    const instance = {
      repls: [
        { outputStream: { write: () => { calls += 1; } } },
        { outputStream: { write: () => { calls += 1; } } },
      ],
    };
    log.call(instance, 'test');
    assert.strictEqual(calls, 2);
  });
});
