'use strict';

const chokidar = require('chokidar');

const watcher = chokidar.watch(__dirname + '/dir1');

watcher.on('all', (event, path) => {
  console.log(event, path);
});