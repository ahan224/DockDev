'use strict';

var _path = require('path');

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const initObj = { name: 'sam' };

const test = { first: initObj };

test.first.watcher = _chokidar2.default.watch((0, _path.join)(__dirname, '..', '..', 'test', 'userFolder', 'syncTest'));

test.first.watcher.on('all', (event, path) => {
  console.log(event, path);
});

test.first = _ramda2.default.merge(test.first, { name: 'hello' });

console.log(test.first);

console.log(test.first === initObj);

console.log(initObj.watcher === test.first.watcher);