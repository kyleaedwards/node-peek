# node-peek
REPL add-on for debugging and benchmarking Node applications.

[![Build Status](https://travis-ci.org/kyleaedwards/node-peek.svg?branch=master)](https://travis-ci.org/kyleaedwards/node-peek)
[![Coverage Status](https://coveralls.io/repos/github/kyleaedwards/node-peek/badge.svg?branch=master)](https://coveralls.io/github/kyleaedwards/node-peek?branch=master)

## Installation

```
npm install --save node-peek
```

Once installed, require `node-peek` on your main server file and run `node {SERVER_FILE} --repl`.

> **DISCLAIMER**: `node-peek` creates a small Unix socket server on your running process to allow you to connect and debug live, as well as run and alter functions you choose to expose. Because this uses extra resources and could potentially be a security risk, all `node-peek` methods will default to noop and the socket server will not start without the `--repl` flag.

You can then use `peek()` to expose variables to the REPL if it's running.

## Setup

```
const peek = require('node-peek');

/* Make variables accessible to REPL. */
peek('key', value);
peek({
  anotherKey: anotherValue
});

/* Console log to all REPLs */
peek.log(obj1, obj2);

/* Close REPL */
peek.close();

/* Change REPL prompt prefix. */
// Before: $ repl >
peek.setPrompt('my-own-repl');
// After: $ my-own-repl >

/* Define custom REPL commands, identical to built-in REPL API. */
peek.defineCommand('savestate', () => {
  fs.writeFile('/tmp/statefile.json', JSON.stringify(state), () => {
    this.outputStream.write('State saved!');
  });
});
```

## Usage

```
$ ./node_modules/.bin/repl
```

Use like the normal Node REPL with additional helpers and custom commands.

```
$ repl > 2 + 2
$ 4
$
$ repl > .hdump
$ Heapdump written to /tmp/heap.1485844418719.heapsnapshot
```

### Commands

* **.gc**: Forces garbage collection.
* **.hdump**: Forces a heapdump to the /tmp directory.
* **.hsize**: Outputs the current heap stats in bytes.
* **.hcsv**: Call once to begin reading intermittent benchmarking data into a CSV file, call again to stop.

## Special Thanks to

* https://gist.github.com/TooTallNate/2209310
* https://github.com/martinj/node-net-repl
