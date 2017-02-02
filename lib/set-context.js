'use strict';

/**
 * Set variables in the REPL context.
 *
 * @param {String|Object}  key      Keyname or object containing K-V pairs
 * @param {Any}            [value]  Optional value if first param is a key
 */
module.exports = function setContext(key, value) {
  if (key) {
    const newCtx = typeof key !== 'object' ? { [key]: value } : key;
    Object.assign(this.context, newCtx);
    this.repls.forEach((r) => {
      Object.keys(newCtx).forEach((k) => {
        const val = newCtx[k];
        r.context[k] = typeof val === 'function' ? val.bind(r.context) : val;
      });
    });
  }
};
