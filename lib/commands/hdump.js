'use strict';

/* Imports */
const heapdump = require('heapdump');

module.exports = {
  help: 'Forces a heap dump into the /tmp directory.',
  action() {
    const filename = `/tmp/${this.promptName}.${Date.now()}.heapsnapshot`;
    this.lineParser.reset();
    this.bufferedCommand = '';
    heapdump.writeSnapshot(filename, (err, fn) => {
      this.outputStream.write(`Heapdump written to ${fn}\n`);
      this.displayPrompt();
    });
  },
};
