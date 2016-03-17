'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFileWatcher = addFileWatcher;

var _path = require('path');

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _rsync = require('./rsync.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addFileWatcher(projObj) {
  var watcher = projObj.fileWatcher = _chokidar2.default.watch(projObj.basePath);

  var projectSync = (0, _rsync.generateRsync)(projObj);

  watcher.on('all', function (event, path) {
    return projectSync();
  });
}

// const initObj = {name:'sam'};
//
// const test = {first: initObj};
//
// test.first.watcher = chokidar.watch(join(__dirname, '..', '..', 'test', 'userFolder', 'syncTest'));
//
// test.first.watcher.on('all', (event, path) => {
//   console.log(event, path);
// });

// test.first = R.merge(test.first, {name: 'hello'});
//
// console.log(test.first);
//
// console.log(test.first === initObj);
//
// console.log(initObj.watcher === test.first.watcher);