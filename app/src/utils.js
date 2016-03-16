'use strict';

import fs from 'fs';
import child_process from 'child_process';
import { join } from 'path';
import Promise, { coroutine as co } from 'bluebird';
import R from 'ramda';
import uuid from 'node-uuid';

// promisify certain callback functions
const mkdir = Promise.promisify(fs.mkdir);
const writeFile = Promise.promisify(fs.writeFile);
export const readFile = Promise.promisify(fs.readFile);
export const exec = Promise.promisify(child_process.exec);

/**
* @param {object} config has project config settings
* @param {string} config.folder is where project config details are stored
* @param {string} config.file is file name for dockdev project config
* @param {[string]} config.writeParams list the project config props that will be written to disk
* @param {function} config.path is relative to a projects base path (i.e. user selected folder)
*/
export const config = {
  folder: '.dockdev',
  file: 'dockdev.json',
  writeParams: ['uuid', 'projectName'],
  path() {
    return join(this.folder, this.file)
  }
}

// object to store all projects
export const memory = {};

/**
* @param {object} store machine config details
* @param {object} props are machine names and vals are promises
*/
export const machines = {};

// JSONStringifyPretty :: object -> string
// predefines JSON stringify with formatting
const JSONStringifyPretty = (obj) => JSON.stringify(obj, null, 2);

// createConfig :: string -> string -> object
// accepts a project name & basePath, returns object with uuid
export const createConfig = (basePath, projectName) => ({
  uuid: uuid.v4(),
  projectName,
  basePath
});

// createDockDev :: object -> promise(object)
// initializes a new DockDev project by adding a .dockdev
export const createDockDev = (configObj) => mkdir(join(configObj.basePath, config.folder));

// cleanConfigToWrite :: object -> string
// removes in-memory properties to write config to dockdev.json
// also JSON stringifies with indent formatting
const cleanConfigToWrite = R.compose(
  JSONStringifyPretty,
  R.pick(config.writeParams)
)

// writeConfig :: string -> function -> object -> promise(object)
// writes the config object to the specified path
// it will overwrite any existing file.
// should be used with readConfig for existing projects
export const writeConfig = (configObj) => (
  writeFile(join(configObj.basePath, config.path()), cleanConfigToWrite(configObj))
);

// addBasePath :: string -> string -> object
// takes a json string, parses it, and returns a new object with the basePath included
const addBasePath = (jsonObj, basePath) => R.merge(JSON.parse(jsonObj), { basePath });

// readConfig :: string -> promise(object)
// given a base path it will return the parsed JSON file
export const readConfig = co(function *(basePath) {
  const configFile = yield readFile(join(basePath, config.path()));
  return addBasePath(configFile, basePath);
})

// extendConfig :: object -> object
// accepts the existing config as first paramater
// and merges/overwrites with the second object
const extendConfig = R.merge;

// addConfigToMemory :: object -> object -> object
// adds the configObj for the project to the memory object
export const addConfigToMemory = R.curry((memory, configObj) => {
  memory[configObj.uuid] = configObj;
  return configObj
})

export const addToAppMemory = addConfigToMemory(memory);

// initProject :: string -> string -> promise(object)
// combines the sequence of functions to initiate a new projects
// takes a path and a project name and returns the config object
export const initProject = co(function *(basePath, projectName) {
  const configObj = createConfig(basePath, projectName);

  yield createDockDev(configObj);
  yield writeConfig(configObj);

  addToAppMemory(configObj);

  return configObj;
})

// cmdLine :: string -> string -> promise(string)
// returns the stdout of the command line call within a promise
export const cmdLine = R.curry((cmd, args) => exec(`${ cmd } ${ args }`));

// rsync :: string -> promise(string)
// accepts an array of cmd line args for rsync
// returns a promise that resolves to teh stdout
export const rsync = cmdLine('rsync');

// selectWithin :: [string] -> string -> object
// helper function to select specified props from a nested object
const selectWithin = R.curry((array, key, obj) => {
  const result = {};
  array.forEach(val => result[val] = obj[key][val]);
  return result;
})

// createRsyncArgs :: string -> string -> object -> [string]
// accepts source, destination, and machine info
// returns an array of arguments for rsync
//** this should be redesigned to output just a string
const createRsyncArgs = R.curry((source, dest, machine) => {
  const result = ['-a', '-e'];
  result.push(`"ssh -i ${ machine.SSHKeyPath } -o IdentitiesOnly=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"`);
  result.push('--delete');
  result.push(source);
  result.push(`docker@${ machine.IPAddress }:${ dest }`)
  return result;
});

// selectSSHandIP :: object -> object
// selects ssh and ip address from docker-machine inspect object
const selectSSHandIP = R.compose(
  selectWithin(['SSHKeyPath', 'IPAddress'], 'Driver'),
  JSON.parse
);


// generateRsync :: object -> function
// accepts a config object and returns a function that is
// called when files change in the base directory of project
export const generateRsync = config => {


}


// - File watch
//   - need ability to turnoff file watching
//   - handle if the root folder name is changed (need new watch)
//   - handle multiple project watches simultaneously
//   - use closure to avoid getting machine inspect 2x (same for volume)
//   - create one watcher and then reference root directory
//
// - Rsync
//   - put the promise that resolves machine ip, ssh, volume location, etc in closure
//   - return a function that requires no parameters, but will rsync after promise resolves
//   - need to consider error handling, but otherwise this solution should work great
//   - should you rsync only the file or folder that changed or everything
