'use strict';

/* Imports */
const assert = require('assert');
const testRepl = require('../../fixtures/repl');
const hdump = require('../../../lib/commands/hdump');
const fs = require('fs');

describe('commands -> hdump', function callback() {
  this.timeout(5000);
  it('should print sequential heap data to a file', (done) => {
    hdump.action.call(testRepl({
      outputStream: {
        write: (text) => {
          const file = text.split(' ').pop().trim();
          assert.strictEqual(fs.existsSync(file), true);
          fs.unlinkSync(file);
          done();
        },
      },
    }));
  });
});
