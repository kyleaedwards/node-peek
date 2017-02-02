'use strict';

/**
 * Defines a command all active and future REPLs. Uses the same API
 * as the native node repl module.
 *
 * @param {String}          cmd     Command key
 * @param {Object|Function} action  Object/function describing REPL action
 */
module.exports = function defineCommand(cmd, action) {
  this.repls.forEach(r => r.defineCommand(cmd, action));
  this.commands[cmd] = action;
};
