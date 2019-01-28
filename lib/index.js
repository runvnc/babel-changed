#!/usr/bin/env node
'use strict';

var _fileEntryCache = require('file-entry-cache');

var _fileEntryCache2 = _interopRequireDefault(_fileEntryCache);

var _hashSum = require('hash-sum');

var _hashSum2 = _interopRequireDefault(_hashSum);

var _lodash = require('lodash.uniq');

var _lodash2 = _interopRequireDefault(_lodash);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _flatCache = require('flat-cache');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pty = require('node-pty');

var key = 'stat_' + (0, _hashSum2.default)(process.cwd());

var node = process.argv[0];
var runonly = process.argv[1];
var src = process.argv[2];

var path = '';
if (src == '--reset') {
  console.log('Clearing file stats so next run will include all files..');
  console.log(path);
  try {
    (0, _flatCache.clearCacheById)(key);
  } catch (e) {
    console.log('Problem clearing cache:', e);
    process.exit(0);
  }
  console.log('File entry Cache cleared.');
  process.exit(0);
}

var cmd = 'babel';
var options = process.argv.slice(3);

var files = _glob2.default.sync(src + '/**/*.js*');
if (!files.length) files = [files];

files = (0, _lodash2.default)(files);

var cache = _fileEntryCache2.default.create(key);

var updated = cache.getUpdatedFiles(files);

console.log(updated.length + ' modified files.');

var newArgs = null;

if (updated && updated.length > 0) {
  newArgs = [src, '--only', updated.join(',')].concat(options);
} else {
  console.log('Nothing to do.');
  process.exit(0);
}

console.log('> babel ' + newArgs.join(' '));

var fileCount = 0;

var term = pty.spawn(cmd, newArgs, {
  name: process.env.TERM,
  cols: 80,
  rows: 25,
  cwd: process.cwd(),
  env: process.env
});

term.on('data', function (data) {
  process.stdout.write(data);
});

term.on('exit', function (code) {
  console.log('babel-changed detected exit code ', code);
  if (code * 1 == 0) cache.reconcile();
  process.exit(code);
});