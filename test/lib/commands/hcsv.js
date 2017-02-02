'use strict';

/* Imports */
const assert = require('assert');
const testRepl = require('../../fixtures/repl');
const hcsv = require('../../../lib/commands/hcsv');
const fs = require('fs');

describe('commands -> hcsv', function callback() {
  this.timeout(5000);
  it('should print sequential heap data to a file', (done) => {
    const repl = testRepl({
      outputStream: {
        write: (text) => {
          const file = text.split(' ').pop().trim();
          assert.strictEqual(fs.existsSync(file), true);
          const contents = fs.readFileSync(file, {
            encoding: 'utf8',
          });
          assert.strictEqual(contents.split('\n').length, 4);
          fs.unlinkSync(file);
          done();
        },
      },
    });
    hcsv.action.call(repl);
    setTimeout(() => {
      hcsv.action.call(repl);
    }, 2500);
  });
});
