'use strict';

/* Imports */
const assert = require('assert');
const testRepl = require('../../fixtures/repl');
const hsize = require('../../../lib/commands/hsize');

describe('commands -> hsize', () => {
  it('should print heap data for the current process', () => {
    hsize.action.call(testRepl({
      outputStream: {
        write: text => assert.ok(text.match(/: \d+\n$/)),
      },
    }));
  });
});
