This runs babel on files that have been modified since the last run only.  It uses
`file-entry-cache`.  The first run will have no modification times saved yet so it will
run on all files.  _Note: To delete the file stat cache so that the next run will
includes all files, use the command `babel-changed --reset`._

This is just an alternative to using `--watch` for weird people like me that never got 
in the habit of doing that.

## Install

npm i -D babel-changed

*Note: you will need to also install babel as per usual.*

## Usage

Note: I have tested this on my own computer with just my own simple babel command.  Beyond that
it may not work right, so YMMV.

Put something close to this in your `scripts` (note that the first argument is the source directory):

```json
"build": "babel-changed src -d lib",
"clean": "babel-changed --reset"

```

Then, assuming babel, babelrc, plugins etc. are all set up, run:

```shell
npm run build
```

If there are modified files detected it will mention the number and pass a list of them
as an `--only` option to babel.  Otherwise it won't do anything.  To rebuild everything next time, run
`npm run clean` (no other arguments).

FYI, It spawns babel with `pty.js`.  Also the file stat data is in `node_modules/flat-cache/.cache/`.


