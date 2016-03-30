import chokidar from 'chokidar';
import { generateRsync } from './rsync.js';
import _ from 'lodash';

/**
 * addFileWatcher() watches the file system starting at the project's basePath
 * and has an event listener, 'all', which runs rsync on changes to the project
 * based on the passed in project object
 *
 * @param {Object} projObj
 * @return {Emitter} all
 */
function fileWatch(projObj) {
  const watcher = projObj.fileWatcher = chokidar.watch(projObj.basePath);

  const projectSync = generateRsync(projObj);

  // let last;
  // const test = () => {
  //   if (!last || last.isPending()) {
  //     last = projectSync();
  //   }
  // };

  watcher.on('all', _.throttle(projectSync, 1000));

  return watcher;
}

export default fileWatch;
