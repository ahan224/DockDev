'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rsync = exports.dockerMachine = exports.createConfig = exports.readConfig = exports.writeConfig = exports.createDockDev = undefined;

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

// config file names
const configFolder = '.dockdev';
const configFile = 'dockdev.json';

// createFolder :: string -> string -> object
// wraps mkdir in a promise and splits new folder from base path
const createFolder = _ramda2.default.curry((folderName, path) => {
  path = (0, _path.join)(path, folderName);
  return new _bluebird2.default((resolve, reject) => {
    (0, _fs.mkdir)(path, err => {
      if (err) return reject(err);
      return resolve(path);
    });
  });
});

// createDockDev :: string -> string -> object
// initializes a new DockDev project by adding a .dockdev
const createDockDev = exports.createDockDev = createFolder(configFolder);

// writeJSON :: string -> object -> string -> object
// wraps writeFile in a promise, accepts an object and stringifies it
const writeJSON = _ramda2.default.curry((fileName, obj, path) => {
  path = (0, _path.join)(path, fileName);
  return new _bluebird2.default((resolve, reject) => {
    (0, _fs.writeFile)(path, JSON.stringify(obj, null, 2), err => {
      if (err) return reject(err);
      return resolve(path);
    });
  });
});

// writeConfig :: object -> string -> object
// writes the config object to the specified path
// it will overwrite any existing file.
// should be used with readConfig for existing projects
const writeConfig = exports.writeConfig = writeJSON(configFile);

// readJSON :: string -> string -> object
// wraps readFile in a promise and splits filename from base path
const readJSON = _ramda2.default.curry((fileName, path) => {
  path = (0, _path.join)(path, fileName);
  return new _bluebird2.default((resolve, reject) => {
    (0, _fs.readFile)(path, 'utf-8', (err, data) => {
      if (err) return reject(err);
      return resolve(JSON.parse(data));
    });
  });
});

// readConfig :: string -> object
// given a base path it will return the parsed JSON file
const readConfig = exports.readConfig = readJSON(configFile);

// createConfig :: string -> object
// accepts a project name and returns an object with uuid and projectName properties
const createConfig = exports.createConfig = projectName => ({
  uuid: _nodeUuid2.default.v4(),
  projectName: projectName
});

// cmdLine :: string -> [string] -> object
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

// dockerMachine :: [string] -> object
// accepts an array of cmd line args for docker-machine
// returns a promise that resolves to the stdout
const dockerMachine = exports.dockerMachine = cmdLine('docker-machine');

// rsync :: [string] -> object
// accepts an array of cmd line args for rsync
// returns a promise that resolves to teh stdout
const rsync = exports.rsync = cmdLine('rsync');

// selectWithin :: [string] -> string -> object
// helper function to select specified props from a nested object
const selectWithin = _ramda2.default.curry((array, key, obj) => {
  var result = {};
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