'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRsync = exports.rsync = exports.cmdLine = exports.initProject = exports.addToAppMemory = exports.addProjToMemory = exports.addProjToConfig = exports.readConfig = exports.writeInitialConfig = exports.readProj = exports.writeProj = exports.createDockDev = exports.createProj = exports.memory = exports.config = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// promisify certain callback functions
const mkdir = _bluebird2.default.promisify(_fs2.default.mkdir);
const writeFile = _bluebird2.default.promisify(_fs2.default.writeFile);
const readFile = _bluebird2.default.promisify(_fs2.default.readFile);
const exec = _bluebird2.default.promisify(_child_process2.default.exec);
// const appendFile = Promise.promisify(fs.appendFile);

/**
* @param {object} config has project config settings
* @param {string} config.projFolder is where project config details are stored
* @param {string} config.projFile is projFile name for dockdev project config
* @param {[string]} config.projWriteParams list the project config props that will be written to disk
* @param {function} config.projPath is relative to a projects base path (i.e. user selected projFolder)
*/
const config = exports.config = {
  // main config infomration
  configFolder: '.dockdevConfig',
  configFile: 'dockdevConfig.json',
  configPath: function (configDirectory) {
    return (0, _path.join)(configDirectory, this.configFolder, this.configFile);
  },


  // individual project infomration
  projFolder: '.dockdev',
  projFile: 'dockdev.json',
  projWriteParams: ['uuid', 'projectName'],
  projPath: function () {
    return (0, _path.join)(this.projFolder, this.projFile);
  }
};

// JSONStringifyPretty :: object -> string
// predefines JSON stringify with formatting
const JSONStringifyPretty = obj => JSON.stringify(obj, null, 2);

// object to store all projects
const memory = exports.memory = {};

// createProj :: string -> string -> object
// accepts a project name & basePath, returns object with uuid
const createProj = exports.createProj = (basePath, projectName) => ({
  uuid: _nodeUuid2.default.v4(),
  projectName: projectName,
  basePath: basePath
});

// createDockDev :: object -> promise(object)
// initializes a new DockDev project by adding a .dockdev
const createDockDev = exports.createDockDev = projObj => mkdir((0, _path.join)(projObj.basePath, config.projFolder));

// cleanProjToWrite :: object -> string
// removes in-memory properties to write config to dockdev.json
// also JSON stringifies with indent formatting
const cleanProjToWrite = _ramda2.default.compose(JSONStringifyPretty, _ramda2.default.pick(config.projWriteParams));

// writeProj :: string -> function -> object -> promise(object)
// writes the config object to the specified path
// it will overwrite any existing projFile.
// should be used with readProj for existing projects
const writeProj = exports.writeProj = projObj => {
  return writeFile((0, _path.join)(projObj.basePath, config.projPath()), cleanProjToWrite(projObj));
};

// addBasePath :: string -> string -> object
// takes a json string, parses it, and returns a new object with the basePath included
const addBasePath = (jsonObj, basePath) => _ramda2.default.merge(JSON.parse(jsonObj), { basePath: basePath });

// readProj :: string -> promise(object)
// given a base path it will return the parsed JSON projFile
const readProj = exports.readProj = (0, _bluebird.coroutine)(function* (basePath) {
  const readProjFile = yield readFile((0, _path.join)(basePath, config.projPath()));
  return addBasePath(readProjFile, basePath);
});

const writeInitialConfig = exports.writeInitialConfig = configDirectory => {
  writeFile((0, _path.join)(configDirectory, config.configFolder, config.configFile), JSONStringifyPretty({
    configDirectory: configDirectory,
    projects: []
  }));
};

// after reading the main configFile, we are going to load all the paths
// export const loadPaths = co(function *(configFile) {
//   let dataToSend = configFile.projects.map( project => {
//     return JSON.parse(yield readFile(join(project.basePath, config.projPath())));
//   }
// })

// after reading the main configFile, we are going to load all the paths
// export const loadPaths = co(function *(configFile) {
//   let dataToSend = configFile.projects.map( project => {
//     try {
//       return JSON.parse(yield readFile(join(project.basePath, config.projPath())));
//     } catch (e) {
//
//     }
//   }
//
// })

// reads the main configFile at launch of the app, if the file doesn't exist, it writes the file
const readConfig = exports.readConfig = (0, _bluebird.coroutine)(function* (configDirectory) {
  let readConfigFile;

  try {
    readConfigFile = JSON.parse((yield readFile((0, _path.join)(configDirectory, config.configFolder, config.configFile))));
    yield loadPaths(readConfigFile);
  } catch (e) {
    console.log(e);
  }

  if (!readConfigFile) yield writeInitialConfig(configDirectory);
});

// adds projects uuid and paths to the main config file
const addProjToConfig = exports.addProjToConfig = (0, _bluebird.coroutine)(function* (configDirectory, uuid, basePath) {
  let readConfigFile = JSON.parse((yield readConfig(configDirectory)));
  readConfigFile.projects.push({ uuid: uuid, basePath: basePath });
  yield writeFile((0, _path.join)(configDirectory, config.configFolder, config.configFile), JSONStringifyPretty(readConfigFile));
});

// I don't think we are using this at all
// extendConfig :: object -> object
// accepts the existing config as first paramater
// and merges/overwrites with the second object
const extendConfig = _ramda2.default.merge;

// addProjToMemory :: object -> object -> object
// adds the projObj for the project to the memory object
const addProjToMemory = exports.addProjToMemory = _ramda2.default.curry((memory, projObj) => {
  memory[projObj.uuid] = projObj;
  return projObj;
});

const addToAppMemory = exports.addToAppMemory = addProjToMemory(memory);

// initProject :: string -> string -> promise(object)
// combines the sequence of functions to initiate a new projects
// takes a path and a project name and returns the config object
const initProject = exports.initProject = (0, _bluebird.coroutine)(function* (basePath, projectName, configDirectory) {
  const projObj = createProj(basePath, projectName);

  yield createDockDev(projObj);
  yield writeProj(projObj);

  addToAppMemory(projObj);

  return projObj;
});

// cmdLine :: string -> string -> promise(string)
// returns the stdout of the command line call within a promise
const cmdLine = exports.cmdLine = _ramda2.default.curry((cmd, args) => exec(`${ cmd } ${ args }`));

// rsync :: string -> promise(string)
// accepts an array of cmd line args for rsync
// returns a promise that resolves to teh stdout
const rsync = exports.rsync = cmdLine('rsync');

// selectWithin :: [string] -> string -> object
// helper function to select specified props from a nested object
const selectWithin = _ramda2.default.curry((array, key, obj) => {
  const result = {};
  array.forEach(val => result[val] = obj[key][val]);
  return result;
});

// createRsyncArgs :: string -> string -> object -> [string]
// accepts source, destination, and machine info
// returns an array of arguments for rsync
//** this should be redesigned to output just a string
const createRsyncArgs = _ramda2.default.curry((source, dest, machine) => {
  const result = ['-a', '-e'];
  result.push(`"ssh -i ${ machine.SSHKeyPath } -o IdentitiesOnly=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"`);
  result.push('--delete');
  result.push(source);
  result.push(`docker@${ machine.IPAddress }:${ dest }`);
  return result;
});

// selectSSHandIP :: object -> object
// selects ssh and ip address from docker-machine inspect object
const selectSSHandIP = _ramda2.default.compose(selectWithin(['SSHKeyPath', 'IPAddress'], 'Driver'), JSON.parse);

// generateRsync :: object -> function
// accepts a config object and returns a function that is
// called when files change in the base directory of project
const generateRsync = exports.generateRsync = config => {};

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