'use strict';

/* Imports */
const assert = require('assert');
const testRepl = require('../../fixtures/repl');
const dotgc = require('../../../lib/commands/gc');

/* Constants */
const gcerr = 'Run your server with the `--expose-gc` flag to enable garbage collection.\n';

describe('commands -> gc', () => {
  it('should fail when gc is not enabled', () => {
    dotgc.action.call(testRepl({
      outputStream: {
        write: text => assert.strictEqual(text, gcerr),
      },
    }));
  });
  it('should force a gc when enabled', (done) => {
    global.gc = done;
    dotgc.action.call(testRepl());
  });
});
