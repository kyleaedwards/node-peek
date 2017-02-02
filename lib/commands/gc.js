'use strict';

module.exports = {
  help: 'Forces a garbage collection.',
  action() {
    this.lineParser.reset();
    this.bufferedCommand = '';
    try {
      global.gc();
      this.outputStream.write('Garbage collected.\n');
    } catch (e) {
      this.outputStream.write('Run your server with the `--expose-gc` flag to enable garbage collection.\n');
    }
    this.displayPrompt();
  },
};
