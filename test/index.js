'use strict';

/**
 * Imports
 */
const assert = require('assert');

describe('node-peek', () => {
  it('should provide noops if flag/env not set', () => {
    const peek = require('..'); // eslint-disable-line global-require
    const noop = peek;
    assert.strictEqual(noop, peek.close);
    assert.strictEqual(noop, peek.setPrompt);
    assert.strictEqual(noop, peek.defineCommand);
    assert.strictEqual(noop, peek.log);
    delete require.cache[require.resolve('..')];
  });
  it('should provide noops if flag/env not set', () => {
    process.env.REPL = 'true';
    const peek = require('..'); // eslint-disable-line global-require
    assert.strictEqual(typeof peek, 'function');
    assert.notEqual(peek.setContext, peek.close);
    delete require.cache[require.resolve('..')];
  });
});
