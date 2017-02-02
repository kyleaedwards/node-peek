'use strict';

/* Imports */
const assert = require('assert');
const testRepl = require('../../fixtures/repl');
const cya = require('../../../lib/commands/cya');

describe('commands -> cya', () => {
  it('should print a message and close the repl', (done) => {
    cya.action.call(testRepl({
      outputStream: {
        write: text => assert.strictEqual(text, 'SEE YOU SPACE COWBOY...\n'),
      },
      close: done,
    }));
  });
});
