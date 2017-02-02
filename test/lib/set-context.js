'use strict';

/* Imports */
const assert = require('assert');
const setContext = require('../../lib/set-context');

describe('setContext()', () => {
  it('should set contexts of existing repls and store', () => {
    const instance = {
      context: {},
      repls: [
        { context: {} },
        { context: {} },
      ],
    };
    setContext.call(instance, 'test', 'value');
    setContext.call(instance, {
      func() {
        return this;
      },
    });
    assert.strictEqual(instance.context.test, 'value');
    assert.strictEqual(instance.repls[0].context.test, 'value');
    assert.strictEqual(instance.repls[1].context.test, 'value');

    // Make sure functions bind to the context.
    assert.strictEqual(instance.repls[0].context, instance.repls[0].context.func());
    assert.strictEqual(instance.repls[1].context, instance.repls[1].context.func());
  });
  it('should do nothing if no key present', () => {
    const instance = {
      context: {},
      repls: [
        { context: {} },
        { context: {} },
      ],
    };
    setContext.call(instance);
    assert.deepEqual(instance, {
      context: {},
      repls: [
        { context: {} },
        { context: {} },
      ],
    });
  });
});
