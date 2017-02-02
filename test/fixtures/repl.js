'use strict';

module.exports = (overrides) => {
  const testRepl = {
    promptName: 'repl',
    lineParser: {
      reset: () => {},
    },
    bufferedCommand: '',
    outputStream: {
      write: () => {},
    },
    displayPrompt: () => {},
  };
  return Object.assign({}, testRepl, overrides);
};
