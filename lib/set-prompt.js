'use strict';

/**
 * Sets the REPL prompt prefix.
 *
 * @param {String}          name    Prompt name
 */
module.exports = function setPrompt(name) {
  this.options.prompt = `${name} > `;
  this.options.name = name;
  this.repls.forEach((r) => {
    r.promptName = name;
    r.setPrompt(this.options.prompt);
  });
};
