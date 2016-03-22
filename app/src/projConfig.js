import fs from 'fs';
import childProcess from 'child_process';
import { join } from 'path';
import Promise, { coroutine as co } from 'bluebird';
import R from 'ramda';
import uuid from 'node-uuid';
import * as utils from './utils';

/**
* @param {object} config has project config settings
* @param {string} config.projFolder is where project config details are stored
* @param {string} config.projFile is projFile name for dockdev project config
* @param {[string]} config.projWriteParams list the project config props that will be written to disk
* @param {function} config.projPath is relative to a projects base path (i.e. user selected projFolder)
*/

// object to store all projects
export const memory = {};

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

  // addProjToConfig(basePath);
  addToAppMemory(projObj);

  return projObj;
});

// initProject(process.env.HOME, 'testProject');
