'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRsync = exports.docker = exports.rsync = exports.dockerMachine = exports.initiateProject = exports.addToAppMemory = exports.addConfigToMemory = exports.readConfig = exports.writeConfig = exports.createDockDev = exports.createConfig = exports.configWriteParams = exports.memory = undefined;

var _fs = require('fs');

var _path = require('path');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// config variables
const configFolder = '.dockdev';
const configFile = 'dockdev.json';

// object to store all projects
const memory = exports.memory = {};

// list of the parameters from the configObj that should be
// written to dockdev.json.  Remaining parameters are in-memory only.
// this needs to be updated for properties that should be stored on disk
const configWriteParams = exports.configWriteParams = ['uuid', 'projectName'];

// JSONStringifyPretty :: a -> string
// predefines JSON stringify with formatting
const JSONStringifyPretty = obj => JSON.stringify(obj, null, 2);

// createConfig :: string -> string -> object
// accepts a project name & basePath, returns object with uuid
const createConfig = exports.createConfig = (basePath, projectName) => ({
  uuid: _nodeUuid2.default.v4(),
  projectName: projectName,
  basePath: basePath
});

// createFolder :: string -> object -> promise(object)
// wraps mkdir in a promise and splits new folder from base path
const createFolder = _ramda2.default.curry((folderName, configObj) => {
  const path = (0, _path.join)(configObj.basePath, folderName);
  return new _bluebird2.default((resolve, reject) => {
    (0, _fs.mkdir)(path, err => {
      if (err) return reject(err);
      return resolve(configObj);
    });
  });
});

// createDockDev :: object -> promise(object)
// initializes a new DockDev project by adding a .dockdev
const createDockDev = exports.createDockDev = createFolder(configFolder);

// writeFileProm :: string -> function -> object -> promise(object)
// wraps writeFile in a promise, accepts an object and a transformation
const writeFileProm = _ramda2.default.curry((fileName, transform, configObj) => {
  const path = (0, _path.join)(configObj.basePath, fileName);
  return new _bluebird2.default((resolve, reject) => {
    (0, _fs.writeFile)(path, transform(configObj), err => {
      if (err) return reject(err);
      return resolve(configObj);
    });
  });
});

// cleanConfigToWrite :: object -> string
// removes in-memory properties to write config to dockdev.json
// also JSON stringifies with indent formatting
const cleanConfigToWrite = _ramda2.default.compose(JSONStringifyPretty, _ramda2.default.pick(configWriteParams));

// writeConfig :: string -> function -> object -> promise(object)
// writes the config object to the specified path
// it will overwrite any existing file.
// should be used with readConfig for existing projects
const writeConfig = exports.writeConfig = writeFileProm((0, _path.join)(configFolder, configFile), cleanConfigToWrite);

// readJSON :: string -> string -> promise(object)
// wraps readFile in a promise and splits filename from base path
// returns the config object with the basePath added
// transform is a function that takes the JSON string and basePath
// other transform functions can be created if they follow that structure
const readJSON = _ramda2.default.curry((fileName, transform, basePath) => {
  const path = (0, _path.join)(basePath, fileName);
  return new _bluebird2.default((resolve, reject) => {
    (0, _fs.readFile)(path, 'utf-8', (err, data) => {
      if (err) return reject(err);
      return resolve(transform(data, basePath));
    });
  });
});

// addBasePath :: string -> string -> object
// takes a json string, parses it, and returns a new object with the basePath included
const addBasePath = (jsonObj, basePath) => _ramda2.default.merge(JSON.parse(jsonObj), { basePath: basePath });

// readConfig :: string -> promise(object)
// given a base path it will return the parsed JSON file
const readConfig = exports.readConfig = readJSON((0, _path.join)(configFolder, configFile), addBasePath);

// extendConfig :: object -> object
// accepts the existing config as first paramater
// and merges/overwrites with the second object
const extendConfig = _ramda2.default.merge;

// addConfigToMemory :: object -> object -> object
// adds the configObj for the project to the memory object
const addConfigToMemory = exports.addConfigToMemory = _ramda2.default.curry((memory, configObj) => {
  memory[configObj.uuid] = configObj;
  return configObj;
});

const addToAppMemory = exports.addToAppMemory = addConfigToMemory(memory);

// initiateProject :: string -> string -> promise(object)
// combines the sequence of functions to initiate a new projects
// takes a path and a project name and returns the config object
const initiateProject = exports.initiateProject = (basePath, projectName) => {
  const configObj = createConfig(basePath, projectName);

  return createDockDev(configObj).then(writeConfig).then(addToAppMemory);
};

// cmdLine :: string -> [string] -> promise(string)
// returns the stdout of the command line call within a promise
const cmdLine = _ramda2.default.curry((cmd, args) => {
  args = `${ cmd } ${ args.join(' ') }`;
  return new _bluebird2.default((resolve, reject) => {
    (0, _child_process2.default)(args, (err, stdout) => {
      if (err) reject(err);
      resolve(stdout);
    });
  });
});

// dockerMachine :: [string] -> promise(string)
// accepts an array of cmd line args for docker-machine
// returns a promise that resolves to the stdout
const dockerMachine = exports.dockerMachine = cmdLine('docker-machine');

// rsync :: [string] -> promise(string)
// accepts an array of cmd line args for rsync
// returns a promise that resolves to teh stdout
const rsync = exports.rsync = cmdLine('rsync');

// docker :: [string] -> promise(string)
// accepts an array of cmd line args for docker-machine
// returns a promise that resolves to the stdout
const docker = exports.docker = cmdLine('docker');

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

// const runRsync = (source, dest, machineName) => {
//   dockerMachine(['inspect', machineName])
//   .then(selectSSHandIP)
//   .then(createRsyncArgs(source, dest))
//   .then(rsync)
//   .catch(console.log)
// }

// generateRsync :: object -> function
// accepts a config object and returns a function that is
// called when files change in the base directory of project
const generateRsync = exports.generateRsync = config => {};

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