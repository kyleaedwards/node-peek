'use strict';

/* Imports */
const assert = require('assert');
const defineCommand = require('../../lib/define-command');

describe('defineCommand()', () => {
  it('should add cmd to existing repls and store', () => {
    let calls = 0;
    const dfnCmd = () => { calls += 1; };
    const instance = {
      commands: {},
      repls: [
        { defineCommand: dfnCmd },
        { defineCommand: dfnCmd },
      ],
    };
    defineCommand.call(instance, 'test', 'value');
    assert.strictEqual(calls, 2);
    assert.strictEqual(instance.commands.test, 'value');
  });
});
