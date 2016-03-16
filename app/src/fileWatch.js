import { join } from 'path';
import chokidar from 'chokidar';
import R from 'ramda';

const initObj = {name:'sam'};

const test = {first: initObj};

test.first.watcher = chokidar.watch(join(__dirname, '..', '..', 'test', 'userFolder', 'syncTest'));

test.first.watcher.on('all', (event, path) => {
  console.log(event, path);
});


test.first = R.merge(test.first, {name: 'hello'});

console.log(test.first);

console.log(test.first === initObj);

console.log(initObj.watcher === test.first.watcher);
