'use strict';

import fs from 'fs';
import child_process from 'child_process';
import { join } from 'path';
import Promise, { coroutine as co } from 'bluebird';
import R from 'ramda';
import uuid from 'node-uuid';
import * as fileSearch from '../app/lib/file-search.js';

// promisify certain callback functions
const mkdir = Promise.promisify(fs.mkdir);
const writeFile = Promise.promisify(fs.writeFile);
<<<<<<< HEAD
const readFile = Promise.promisify(fs.readFile);
const exec = Promise.promisify(child_process.exec);
// const appendFile = Promise.promisify(fs.appendFile);
=======
export const readFile = Promise.promisify(fs.readFile);
export const exec = Promise.promisify(child_process.exec);
>>>>>>> docker_request_api

/**
* @param {object} config has project config settings
* @param {string} config.projFolder is where project config details are stored
* @param {string} config.projFile is projFile name for dockdev project config
* @param {[string]} config.projWriteParams list the project config props that will be written to disk
* @param {function} config.projPath is relative to a projects base path (i.e. user selected projFolder)
*/
export const config = {
  // main config infomration
  configFolder: '.dockdevConfig',
  configFile: 'dockdevConfig.json',
  configPath(configDirectory) {
    return join(configDirectory, this.configFolder, this.configFile);
  },

  // individual project infomration
  projFolder: '.dockdev',
  projFile: 'dockdev.json',
  projWriteParams: ['uuid', 'projectName'],
  projPath() {
    return join(this.projFolder, this.projFile)
  }
}

<<<<<<< HEAD
=======
// object to store all projects
export const memory = {};

/**
* @param {object} store machine config details
* @param {object} props are machine names and vals are promises
*/
export const machines = {};

>>>>>>> docker_request_api
// JSONStringifyPretty :: object -> string
// predefines JSON stringify with formatting
const JSONStringifyPretty = (obj) => JSON.stringify(obj, null, 2);


// object to store all projects
export const memory = {};


// createProj :: string -> string -> object
// accepts a project name & basePath, returns object with uuid
export const createProj = (basePath, projectName) => ({
  uuid: uuid.v4(),
  projectName,
  basePath,
});

// createDockDev :: object -> promise(object)
// initializes a new DockDev project by adding a .dockdev
export const createDockDev = (projObj) => mkdir(join(projObj.basePath, config.projFolder));

// cleanProjToWrite :: object -> string
// removes in-memory properties to write config to dockdev.json
// also JSON stringifies with indent formatting
const cleanProjToWrite = R.compose(
  JSONStringifyPretty,
  R.pick(config.projWriteParams)
)

// writeProj :: string -> function -> object -> promise(object)
// writes the config object to the specified path
// it will overwrite any existing projFile.
// should be used with readProj for existing projects
export const writeProj = (projObj) => {
  return writeFile(join(projObj.basePath, config.projPath()), cleanProjToWrite(projObj));
};

// addBasePath :: string -> string -> object
// takes a json string, parses it, and returns a new object with the basePath included
const addBasePath = (jsonObj, basePath) => R.merge(JSON.parse(jsonObj), { basePath });

// readProj :: string -> promise(object)
// given a base path it will return the parsed JSON projFile
export const readProj = co(function *(basePath) {
  const readProjFile = yield readFile(join(basePath, config.projPath()));
  return addBasePath(readProjFile, basePath);
})

export const writeInitialConfig = (configDirectory) => {
  writeFile(join(configDirectory, config.configFolder, config.configFile), JSONStringifyPretty({
    configDirectory,
    projects: []
  }));
};

// after reading the main configFile, we are going to load all the paths
export const loadPaths = co(function *(configFile) {
  let dataToSend = configFile.projects.map( project => {
    return JSON.parse(yield readFile(join(project.basePath, config.projPath())));
  }
})

after reading the main configFile, we are going to load all the paths
export const loadPaths = co(function *(configFile) {
  let dataToSend = configFile.projects.map( project => {
    try {
      return JSON.parse(yield readFile(join(project.basePath, config.projPath())));
    } catch (e) {

    }
  }

})

// reads the main configFile at launch of the app, if the file doesn't exist, it writes the file
export const readConfig = co(function *(configDirectory) {
  let readConfigFile;

  try {
    readConfigFile = JSON.parse(yield readFile(join(configDirectory, config.configFolder, config.configFile)));
    yield loadPaths(readConfigFile);
  } catch (e) {
    console.log(e);
  }

  if (!readConfigFile) yield writeInitialConfig(configDirectory);
});

// adds projects uuid and paths to the main config file
export const addProjToConfig = co(function *(configDirectory, uuid, basePath) {
  let readConfigFile = JSON.parse(yield readConfig(configDirectory));
  readConfigFile.projects.push({uuid, basePath});
  yield writeFile(join(configDirectory, config.configFolder, config.configFile), JSONStringifyPretty(readConfigFile));
})

// I don't think we are using this at all
// extendConfig :: object -> object
// accepts the existing config as first paramater
// and merges/overwrites with the second object
const extendConfig = R.merge;

// addProjToMemory :: object -> object -> object
// adds the projObj for the project to the memory object
export const addProjToMemory = R.curry((memory, projObj) => {
  memory[projObj.uuid] = projObj;
  return projObj
})

export const addToAppMemory = addProjToMemory(memory);

// initProject :: string -> string -> promise(object)
// combines the sequence of functions to initiate a new projects
// takes a path and a project name and returns the config object
export const initProject = co(function *(basePath, projectName, configDirectory) {
  const projObj = createProj(basePath, projectName);

  yield createDockDev(projObj);
  yield writeProj(projObj);

  addToAppMemory(projObj);

  return projObj;
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
//   - need ability to turnoff projFile watching
//   - handle if the root projFolder name is changed (need new watch)
//   - handle multiple project watches simultaneously
//   - use closure to avoid getting machine inspect 2x (same for volume)
//   - create one watcher and then reference root directory
//
// - Rsync
//   - put the promise that resolves machine ip, ssh, volume location, etc in closure
//   - return a function that requires no parameters, but will rsync after promise resolves
//   - need to consider error handling, but otherwise this solution should work great
//   - should you rsync only the projFile or projFolder that changed or everything
