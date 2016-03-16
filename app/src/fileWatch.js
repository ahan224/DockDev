import { join } from 'path';
import chokidar from 'chokidar';
import R from 'ramda';
import { generateRsync } from './rsync.js';

export function addFileWatcher(projObj) {
  const watcher = projObj.fileWatcher = chokidar.watch(projObj.basePath);

  const projectSync = generateRsync(projObj);

  watcher.on('all', (event, path) => {
    return projectSync();
  })
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
