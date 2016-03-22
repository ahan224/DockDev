import chokidar from 'chokidar';
import { generateRsync } from './rsync.js';

export function addFileWatcher(projObj) {
  const watcher = projObj.fileWatcher = chokidar.watch(projObj.basePath);

  const projectSync = generateRsync(projObj);

  watcher.on('all', projectSync);
}
