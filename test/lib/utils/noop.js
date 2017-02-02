'use strict';

/* Imports */
const noop = require('../../../lib/utils/noop');
const assert = require('assert');

describe('utils -> noop', () => {
  it('should be a function with no return value', () => {
    assert.strictEqual(typeof noop, 'function');
    assert.strictEqual(noop(), undefined);
  });
});
