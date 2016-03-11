'use strict';

var chokidar = require('chokidar');

var watcher = chokidar.watch(__dirname + '/dir1');

watcher.on('all', (event, path) => {
  console.log(event, path);
});