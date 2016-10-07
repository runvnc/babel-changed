#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fileEntryCache = require('file-entry-cache');

var _fileEntryCache2 = _interopRequireDefault(_fileEntryCache);

var _hashSum = require('hash-sum');

var _hashSum2 = _interopRequireDefault(_hashSum);

var _lodash = require('lodash.uniq');

var _lodash2 = _interopRequireDefault(_lodash);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _pty = require('pty.js');

var _pty2 = _interopRequireDefault(_pty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var key = 'stat_' + (0, _hashSum2.default)(process.cwd());

var node = process.argv[0];
var runonly = process.argv[1];
var src = process.argv[2];
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

var term = _pty2.default.spawn(cmd, newArgs, {
  name: process.env.TERM,
  cols: 80,
  rows: 25,
  cwd: process.cwd(),
  env: process.env
});

term.on('data', function (data) {
  process.stdout.write(data.toString());
});

term.on('exit', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          cache.reconcile();

        case 1:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
})));