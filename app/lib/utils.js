'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeContainer = exports.addContainer = exports.cmdLine = exports.initProject = exports.addToAppMemory = exports.addProjToMemory = exports.addProjToConfig = exports.readConfig = exports.writeInitialConfig = exports.readProj = exports.writeProj = exports.createDockDev = exports.createProj = exports.memory = exports.config = exports.exec = exports.readFile = exports.writeFile = exports.mkdir = undefined;

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

var _container = require('./container.js');

var container = _interopRequireWildcard(_container);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// promisify certain callback functions
const mkdir = exports.mkdir = _bluebird2.default.promisify(_fs2.default.mkdir);
const writeFile = exports.writeFile = _bluebird2.default.promisify(_fs2.default.writeFile);
const readFile = exports.readFile = _bluebird2.default.promisify(_fs2.default.readFile);
const exec = exports.exec = _bluebird2.default.promisify(_child_process2.default.exec);

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
  projWriteParams: ['uuid', 'projectName', 'containers', 'machine'],
  projPath: function () {
    return (0, _path.join)(this.projFolder, this.projFile);
  }
};

// object to store all projects
const memory = exports.memory = {};

// JSONStringifyPretty :: object -> string
// predefines JSON stringify with formatting
const JSONStringifyPretty = obj => JSON.stringify(obj, null, 2);

// createProj :: string -> string -> object
// accepts a project name & basePath, returns object with uuid
const createProj = exports.createProj = (basePath, projectName) => ({
  uuid: _nodeUuid2.default.v4(),
  projectName: projectName,
  basePath: basePath,
  containers: {},
  machine: 'default'
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

//after reading the main configFile, we are going to load all the paths
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

// need to think about how to pick a default machine
// for now it is hardcoded to 'default' but shouldnt be
const addContainer = exports.addContainer = (0, _bluebird.coroutine)(function* (projObj, image) {
  const containerConfig = container.setContainerParams(image, projObj);
  const containerId = (yield container.create(projObj.machine, containerConfig)).Id;
  const inspectContainer = yield container.inspect(projObj.machine, containerId);
  const dest = inspectContainer.Mounts[0].Source;
  const name = inspectContainer.Name.substr(1);
  projObj.containers[containerId] = { image: image, containerId: containerId, name: name, dest: dest, sync: true };
  return containerId;
});

const removeContainer = exports.removeContainer = (0, _bluebird.coroutine)(function* (projObj, containerId) {
  yield container.remove(projObj.machine, containerId);
  delete projObj.containers[containerId];
  return true;
});