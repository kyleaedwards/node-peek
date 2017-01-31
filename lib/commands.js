'use strict';

/* Imports */
const heapdump = require('heapdump');
const fs = require('fs');

/* Constants */
const MAX_HCSV_ITERATIONS = 10000;
const hcsvStreams = [];
const hcsvIntervals = [];

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
      const filename = `/tmp/${this._name}.${Date.now()}.heapsnapshot`;
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

  hcsv: {
    help: 'Compiles a CSV containing intermittent heap readings over a given period. [ARGS: delay (in sec), iterations]',
    action(options) {
      const args = options.split(' ').map(n => parseInt(n));
      const delay = 1000 * (options.shift() || 1);
      const iterations = options.shift();

      this.lineParser.reset();
      this.bufferedCommand = '';

      if (this._hscvInterval) {
        clearInterval(this._hcsvInterval);
        this._hcsvInterval = null;
        this._hcsvStream.end();
        this.displayPrompt();
        this.outputStream.write(`Heap stats written to ${this._hcsvFile}\n`);
      } else {
        let i = 0;
        this._hcsvFile = `/tmp/${this._name}.${Date.now()}.csv`;
        this._hcsvStream = fs.fileWriteStream(this._hcsvFile);
        this._hcsvStream.write(`rss,heapUsed,heapTotal,external\n`);
        this._hcsvInterval = setInterval(() => {
          if (iterations && i >= iterations) {
            action();
          } else {
            let mem = process.memoryUsage();
            this._hcsvStream.write(`${mem.rss},${mem.heapUsed},${mem.heapTotal},${mem.external}\n`);
          }
          i++;
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
