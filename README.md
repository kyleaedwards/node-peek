# node-peek
REPL add-on for debugging and benchmarking Node applications.

## Installation

```
npm install --save-dev node-peek
```

## Setup

```
require('node-peek');

/* Check if REPL exists. */
if (__replExists__) {
  // Do something.
}

/* Make variables accessible to REPL. */
setREPLContext('key', value);
setREPLContext({
  anotherKey: anotherValue
});

/* Close REPL */
closeREPL();

/* Change REPL prompt prefix. */
// Before: $ repl >
setREPLPrompt('my-own-repl');
// After: $ my-own-repl >

/* Define custom REPL commands, identical to built-in REPL API. */
defineREPLCommand('savestate', () => {
  fs.writeFile('/tmp/statefile.json', JSON.stringify(state), () => {
    this.outputStream.write('State saved!');
  });
});
```

## Usage

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

## Special Thanks to

* https://gist.github.com/TooTallNate/2209310
* https://github.com/martinj/node-net-repl
