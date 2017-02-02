'use strict';

/* Imports */
const fs = require('fs');

module.exports = {
  help: 'Compiles a CSV containing intermittent heap readings over a given period. [ARGS: delay (in ms)]',
  action: function action(options) {
    const args = (options || '').split(' ').map(n => parseInt(n, 10));
    const delay = args.shift() || 1000;

    this.lineParser.reset();
    this.bufferedCommand = '';

    if (this.hcsvInterval) {
      clearInterval(this.hcsvInterval);
      this.hcsvInterval = null;
      this.hcsvStream.end();
      this.displayPrompt();
      this.outputStream.write(`Heap stats written to ${this.hcsvFile}\n`);
    } else {
      this.hcsvFile = `/tmp/${this.promptName}.${Date.now()}.csv`;
      this.hcsvStream = fs.createWriteStream(this.hcsvFile);
      this.hcsvStream.write('rss,heapUsed,heapTotal,external\n');
      this.hcsvInterval = setInterval(() => {
        const mem = process.memoryUsage();
        this.hcsvStream.write(`${mem.rss},${mem.heapUsed},${mem.heapTotal},${mem.external}\n`);
      }, delay);
    }
  },
};
