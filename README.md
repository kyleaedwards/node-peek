# node-peek
REPL add-on for debugging and benchmarking Node applications.

## Installation

```
npm install --save-dev node-peek
```

## Setup

```
const Peek = require('node-peek');

/* Make variables accessible to REPL. */
Peek.setContext('key', value);
Peek.setContext({
  anotherKey: anotherValue
});

/* Close REPL */
Peek.close();

/* Change REPL prompt prefix. */
// Before: $ repl >
Peek.setPrompt('my-own-repl');
// After: $ my-own-repl >

/* Define custom REPL commands, identical to built-in REPL API. */
Peek.defineCommand('savestate', () => {
  fs.writeFile('/tmp/statefile.json', JSON.stringify(state), () => {
    this.outputStream.write('State saved!');
  });
});
```

## Using the REPL

```
$ ./node_modules/.bin/repl
$ repl >
// Use like the normal Node REPL with additional helpers and
// custom commands.
$ repl .hsize
$ RSS: 20619264
$ Heap Used: 4108000
$ Heap Total: 7319552
$ External: 8750
```

### Commands

* **.gc**: Forces garbage collection.
* **.hdump**: Forces a heapdump to the /tmp directory.
* **.hsize**: Outputs the current heap stats in bytes.
* **.hcsv**: Call once to begin reading intermittent benchmarking data into a CSV file, call again to stop.

## Special Thanks to

* https://gist.github.com/TooTallNate/2209310
* https://github.com/martinj/node-net-repl
