'use strict';

module.exports = {
  help: 'Prints the current heap usage stats in bytes.',
  action() {
    const mem = process.memoryUsage();
    this.lineParser.reset();
    this.bufferedCommand = '';
    Object.keys(mem).forEach((key) => {
      const label = {
        rss: 'RSS',
        heapUsed: 'Heap used',
        heapTotal: 'Heap Total',
        external: 'External',
      }[key];
      this.outputStream.write(`${label}: ${mem[key]}\n`);
    });
    this.displayPrompt();
  },
};
