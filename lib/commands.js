'use strict';

const heapdump = require('heapdump');

module.exports = {
  bye: {
    help: 'Closes the REPL.',
    action() {
      this.outputStream.write('SEE YOU SPACE COWBOY...\n');
      this.close();
    },
  },

  hdump: {
    help: 'Forces a heap dump into the /tmp directory.',
    action() {
      const filename = `/tmp/${name}.${Date.now()}.heapsnapshot`;
      this.lineParser.reset();
      this.bufferedCommand = '';
      heapdump.writeSnapshot(filename, (err, fn) => {
        this.outputStream.write(`Heapdump written to ${fn}\n`);
      });
      this.displayPrompt();
    },
  },

  hsize: {
    help: 'Prints the current heap usage stats in bytes.',
    action() {
      let mem = process.memoryUsage();
      this.lineParser.reset();
      this.bufferedCommand = '';
      this.outputStream.write(`RSS: ${mem.rss}\n`);
      this.outputStream.write(`Heap used: ${mem.heapUsed}\n`);
      this.outputStream.write(`Heap total: ${mem.heapTotal}\n`);
      this.outputStream.write(`External: ${mem.external}\n`);
      this.displayPrompt();
    },
  },

  gc: {
    help: 'Forces a garbage collection.',
    action() {
      this.lineParser.reset();
      this.bufferedCommand = '';
      global.gc();
      this.displayPrompt();
    },
  },
};
