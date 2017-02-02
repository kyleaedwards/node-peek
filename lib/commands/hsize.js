'use strict';

module.exports = {
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
};
