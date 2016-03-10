import { mkdir } from 'fs';
import { join } from 'path';
import Promise from 'bluebird';
import R from 'ramda';

// createFolder :: string -> string -> object
// wraps mkdir in a promise and splits new folder from base path
export const createFolder = R.curry((folderName, path) => {
  path = join(path, folderName);
  return new Promise((resolve, reject) => {
    mkdir(path, err => {
      if (err) return reject(err);
      return resolve(path);
    });
  });
});

// initializes a new DockDev project by adding a .dockdev
export const createDockDev = createFolder('.dockdev');
