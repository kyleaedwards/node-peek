'use strict';

module.exports = {
  help: 'Closes the REPL.',
  action() {
    this.outputStream.write('SEE YOU SPACE COWBOY...\n');
    this.close();
  },
};
