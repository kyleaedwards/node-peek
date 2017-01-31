'use strict';

/* Imports */
const heapdump = require('heapdump');
const fs = require('fs');

module.exports = {
  cya: {
    help: 'Closes the REPL.',
    action() {
      this.outputStream.write('SEE YOU SPACE COWBOY...\n');
      this.close();
    },
  },

  hdump: {
    help: 'Forces a heap dump into the /tmp directory.',
    action() {
      const filename = `/tmp/${this.promptName}.${Date.now()}.heapsnapshot`;
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
      const mem = process.memoryUsage();
      this.lineParser.reset();
      this.bufferedCommand = '';
      this.outputStream.write(`RSS: ${mem.rss}\n`);
      this.outputStream.write(`Heap used: ${mem.heapUsed}\n`);
      this.outputStream.write(`Heap total: ${mem.heapTotal}\n`);
      this.outputStream.write(`External: ${mem.external}\n`);
      this.displayPrompt();
    },
  },

  hcsv: {
    help: 'Compiles a CSV containing intermittent heap readings over a given period. [ARGS: delay (in sec), iterations]',
    action: function action(options) {
      const args = options.split(' ').map(n => parseInt(n, 10));
      const delay = 1000 * (args.shift() || 1);
      const iterations = args.shift();

      this.lineParser.reset();
      this.bufferedCommand = '';

      if (this.hscvInterval) {
        clearInterval(this.hcsvInterval);
        this.hcsvInterval = null;
        this.hcsvStream.end();
        this.displayPrompt();
        this.outputStream.write(`Heap stats written to ${this.hcsvFile}\n`);
      } else {
        let i = 0;
        this.hcsvFile = `/tmp/${this.promptName}.${Date.now()}.csv`;
        this.hcsvStream = fs.fileWriteStream(this.hcsvFile);
        this.hcsvStream.write('rss,heapUsed,heapTotal,external\n');
        this.hcsvInterval = setInterval(() => {
          if (iterations && i >= iterations) {
            action();
          } else {
            const mem = process.memoryUsage();
            this.hcsvStream.write(`${mem.rss},${mem.heapUsed},${mem.heapTotal},${mem.external}\n`);
          }
          i += 1;
        }, delay);
      }
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
