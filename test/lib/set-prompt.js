'use strict';

/* Imports */
const assert = require('assert');
const setPrompt = require('../../lib/set-prompt');

describe('setPrompt()', () => {
  it('should add cmd to existing repls and store', () => {
    let calls = 0;
    const setPrmt = () => { calls += 1; };
    const instance = {
      options: {},
      repls: [
        { setPrompt: setPrmt },
        { setPrompt: setPrmt },
      ],
    };
    setPrompt.call(instance, 'testPrompt');
    assert.strictEqual(calls, 2);
    assert.strictEqual(instance.options.prompt, 'testPrompt > ');
    assert.strictEqual(instance.options.name, 'testPrompt');
    assert.strictEqual(instance.repls[0].promptName, 'testPrompt');
    assert.strictEqual(instance.repls[1].promptName, 'testPrompt');
  });
});
