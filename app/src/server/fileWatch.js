import chokidar from 'chokidar';
import { generateRsync } from './rsync.js';

/**
 * addFileWatcher() watches the file system starting at the project's basePath
 * and has an event listener, 'all', which runs rsync on changes to the project
 * based on the passed in project object
 *
 * @param {Object} projObj
 * @return {Emitter} all
 */
export function addFileWatcher(projObj) {
  const watcher = projObj.fileWatcher = chokidar.watch(projObj.basePath);

  const projectSync = generateRsync(projObj);

  watcher.on('all', projectSync);
}
