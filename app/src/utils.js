'use strict';

import fs from 'fs';
import childProcess from 'child_process';
import { join } from 'path';
import Promise, { coroutine as co } from 'bluebird';
import R from 'ramda';
import uuid from 'node-uuid';
import * as container from './container.js';
import { spawn } from 'child_process';

// promisify certain callback functions
export const mkdir = Promise.promisify(fs.mkdir);
export const writeFile = Promise.promisify(fs.writeFile);
export const readFile = Promise.promisify(fs.readFile);
export const exec = Promise.promisify(childProcess.exec);

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
  configPath(locationFolder) {
    return join(locationFolder, this.configFolder, this.configFile);
  },

  // individual project infomration
  projFolder: '.dockdev',
  projFile: 'dockdev.json',
  projWriteParams: ['uuid', 'projectName', 'containers', 'machine'],
  projPath() {
    return join(this.projFolder, this.projFile);
  }
};

// object to store all projects
export const memory = {};

// JSONStringifyPretty :: object -> string
// predefines JSON stringify with formatting
const JSONStringifyPretty = (obj) => JSON.stringify(obj, null, 2);

// createProj :: string -> string -> object
// accepts a project name & basePath, returns object with uuid
export const createProj = (basePath, projectName) => ({
  uuid: uuid.v4(),
  projectName,
  basePath,
  containers: {},
  machine: 'default'
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
);

// writeProj :: string -> function -> object -> promise(object)
// writes the config object to the specified path
// it will overwrite any existing projFile.
// should be used with readProj for existing projects
export const writeProj = (projObj) =>
  writeFile(join(projObj.basePath, config.projPath()), cleanProjToWrite(projObj));

// addBasePath :: string -> string -> object
// takes a json string, parses it, and returns a new object with the basePath included
const addBasePath = (jsonObj, basePath) => R.merge(JSON.parse(jsonObj), { basePath });

// readProj :: string -> promise(object)
// given a base path it will return the parsed JSON projFile
export const readProj = co(function *(basePath) {
  const readProjFile = yield readFile(join(basePath, config.projPath()));
  return addBasePath(readProjFile, basePath);
});

export const writeConfig = co(function *(userSelectedDirectory, locationFolder) {
  if (!userSelectedDirectory) userSelectedDirectory = process.env.HOME;
  yield mkdir(join(locationFolder, config.configFolder));
  yield writeFile(config.configPath(locationFolder), JSONStringifyPretty({
    userSelectedDirectory,
    projects: {}
  }));
});

const findDockdev = (array) => {
  console.log("I am finding things in findDockdev");
  let result = '';
  const find = spawn('find', array);

  find.stdout.on('data', data => {result += data;});

  return new Promise((resolve, reject) => {
    find.stderr.on('data', reject);
    find.stdout.on('close', () => {
      resolve(result.split('\n').slice(0, -1));
    });
  });
};

// findDockdev(['/Users/dbschwartz83/DockDev', '-name', 'index.html'], handleFolders);


// searches for Good Paths
export const searchGoodPaths = co(function *(configFile) {
  const goodPathResults = [];

  for (var key in configFile.projects) {
    try {
      const fileContents = JSON.parse(
        yield readFile(join(configFile.projects[key], config.projPath()))
      );
      goodPathResults.push(fileContents);
    } catch (e) {
      console.log(e);
      delete configFile.projects[key];
    }
  }
  console.log("I am in the search good paths and this is getting sent back: ", goodPathResults)
  return goodPathResults;
});


// search Bad Paths
export const searchBadPaths = co(function *(goodPathsArray, userSelectedDirectory) {
  const searchArray = [];
  if (!userSelectedDirectory) userSelectedDirectory = process.env.HOME;
  // create the parameters for the linux find command
  searchArray.push(userSelectedDirectory);
  searchArray.push('-name');
  searchArray.push(config.projFile);

  // create the parameters for files to exclude based on the projects that were already found
  goodPathsArray.forEach((path) => {
    searchArray.push('!');
    searchArray.push('-path');
    searchArray.push(path);
  });

  const searchResultsToUI = [];

  // returns an array of data
  const searchResults = yield findDockdev(searchArray);
  for (let i = 0; i < searchResults.length; i++) {
    const fileContents = JSON.parse(yield readFile(join(searchResults[i], config.projPath())));
    searchResultsToUI.push(fileContents);
  }
  console.log("I am in the search bad paths and this is getting sent back: ", searchResultsToUI);
  return searchResultsToUI;
});

// after reading the main configFile, we are going to load all the paths
export const loadPaths = co(function *(configFile, userSelectedDirectory) {
  const configProjLength = Object.keys(configFile.projects).length;
  console.log("# of config projects: ", configProjLength)

  const goodResults = yield searchGoodPaths(configFile);

  console.log("# of good paths: ", goodResults.length)

  let badResults;
// search for the other projects if there were any errors in the data
  if (configProjLength !== goodResults.length) {
    badResults = searchBadPaths(goodResults, userSelectedDirectory);
  }

  console.log('Good Results: ', goodResults);
  console.log('Bad Results: ', badResults);
 // return an array of arrays with good and bad paths
  return [goodResults, badResults];
});

// reads the main configFile at launch of the app, if the file doesn't exist, it writes the file
export const readConfig = co(function *(userSelectedDirectory) {
  console.log("I am in read Config");
  try {
    let readConfigFile = yield readFile(config.configPath(process.env.HOME));
    readConfigFile = JSON.parse(readConfigFile);
    return yield loadPaths(readConfigFile, userSelectedDirectory);
  } catch (e) {
    yield writeConfig(userSelectedDirectory, process.env.HOME);
    return {};
  }
});

// adds projects uuid and paths to the main config file
export const addProjToConfig = co(function *(basePath) {
  console.log("I am in add Proj to Config");
  const readConfigFile = JSON.parse(yield readConfig(config.configPath(process.env.HOME)));
  readConfigFile.projects[basePath] = basePath;
  yield writeFile(config.configPath(process.env.HOME), JSONStringifyPretty(readConfigFile));
});

// addProjToMemory :: object -> object -> object
// adds the projObj for the project to the memory object
export const addProjToMemory = R.curry((memory, projObj) => {
  memory[projObj.uuid] = projObj;
  return projObj;
});

export const addToAppMemory = addProjToMemory(memory);

// initProject :: string -> string -> promise(object)
// combines the sequence of functions to initiate a new projects
// takes a path and a project name and returns the config object
export const initProject = co(function *(basePath, projectName) {

  const projObj = createProj(basePath, projectName);

  yield createDockDev(projObj);
  yield writeProj(projObj);

  addProjToConfig(basePath);
  addToAppMemory(projObj);

  return projObj;
});

initProject(process.env.HOME, 'testProject');

// cmdLine :: string -> string -> promise(string)
// returns the stdout of the command line call within a promise
export const cmdLine = R.curry((cmd, args) => exec(`${cmd} ${args}`));

// need to think about how to pick a default machine
// for now it is hardcoded to 'default' but shouldnt be
export const addContainer = co(function *(projObj, image) {
  const containerConfig = container.setContainerParams(image, projObj);
  const containerId = (yield container.create(projObj.machine, containerConfig)).Id;
  const inspectContainer = yield container.inspect(projObj.machine, containerId);
  const dest = inspectContainer.Mounts[0].Source;
  const name = inspectContainer.Name.substr(1);
  projObj.containers[containerId] = {image, containerId, name, dest, sync: true};
  return containerId;
});

export const removeContainer = co(function *(projObj, containerId) {
  yield container.remove(projObj.machine, containerId);
  delete projObj.containers[containerId];
  return true;
});
