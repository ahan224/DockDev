import { mkdir, writeFile, readFile } from 'fs';
import { join } from 'path';
import Promise from 'bluebird';
import R from 'ramda';
import uuid from 'node-uuid';

// config file names
const configFolder = '.dockdev';
const configFile = 'dockdev.json';


// createFolder :: string -> string -> object
// wraps mkdir in a promise and splits new folder from base path
const createFolder = R.curry((folderName, path) => {
  path = join(path, folderName);
  return new Promise((resolve, reject) => {
    mkdir(path, err => {
      if (err) return reject(err);
      return resolve(path);
    });
  });
});

// createDockDev :: string -> string -> object
// initializes a new DockDev project by adding a .dockdev
export const createDockDev = createFolder(configFolder);


// writeJSON :: string -> object -> object
// wraps writeFile in a promise, accepts an object and stringifies it
const writeJSON = R.curry((fileName, obj, path) => {
  path = join(path, fileName);
  return new Promise((resolve, reject) => {
    writeFile(path, JSON.stringify(obj), err => {
      if (err) return reject(err);
      return resolve(path);
    });
  });
});

// writeConfig :: object -> string -> object
// writes the config object to the specified path
// it will overwrite any existing file.
// should be used with readConfig for existing projects
export const writeConfig = writeJSON(configFile);

// readJSON :: string -> string -> object
// wraps readFile in a promise and splits filename from base path
const readJSON = R.curry((fileName, path) => {
  path = join(path, fileName);
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (err, data) => {
      if (err) return reject(err);
      return resolve(JSON.parse(data));
    });
  });
})

// readConfig :: string -> object
// given a base path it will return the parsed JSON file
export const readConfig = readJSON(configFile);

// createConfig :: string -> object
// accepts a project name and returns an object with uuid and projectName properties
export const createConfig = projectName => ({
  uuid: uuid.v4(),
  projectName
})
