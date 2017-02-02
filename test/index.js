'use strict';

/**
 * Imports
 */
const assert = require('assert');

describe('node-peek', () => {
  it('should provide noops if flag/env not set', () => {
    const Peek = require('..'); // eslint-disable-line global-require
    const noop = Peek.setContext;
    assert.strictEqual(noop, Peek.close);
    assert.strictEqual(noop, Peek.setPrompt);
    assert.strictEqual(noop, Peek.defineCommand);
    delete require.cache[require.resolve('..')];
  });
  it('should provide noops if flag/env not set', () => {
    process.env.REPL = 'true';
    const Peek = require('..'); // eslint-disable-line global-require
    assert.notEqual(Peek.setContext, Peek.close);
    delete require.cache[require.resolve('..')];
  });
});
