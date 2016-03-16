'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRsync = exports.rsync = exports.cmdLine = exports.initProject = exports.addToAppMemory = exports.addConfigToMemory = exports.readConfig = exports.writeConfig = exports.createDockDev = exports.createConfig = exports.memory = exports.config = undefined;

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
var mkdir = _bluebird2.default.promisify(_fs2.default.mkdir);
var writeFile = _bluebird2.default.promisify(_fs2.default.writeFile);
var readFile = _bluebird2.default.promisify(_fs2.default.readFile);
var exec = _bluebird2.default.promisify(_child_process2.default.exec);

/**
* @param {object} config has project config settings
* @param {string} config.folder is where project config details are stored
* @param {string} config.file is file name for dockdev project config
* @param {[string]} config.writeParams list the project config props that will be written to disk
* @param {function} config.path is relative to a projects base path (i.e. user selected folder)
*/
var config = exports.config = {
  folder: '.dockdev',
  file: 'dockdev.json',
  writeParams: ['uuid', 'projectName'],
  path: function path() {
    return (0, _path.join)(this.folder, this.file);
  }
};

// object to store all projects
var memory = exports.memory = {};

// JSONStringifyPretty :: object -> string
// predefines JSON stringify with formatting
var JSONStringifyPretty = function JSONStringifyPretty(obj) {
  return JSON.stringify(obj, null, 2);
};

// createConfig :: string -> string -> object
// accepts a project name & basePath, returns object with uuid
var createConfig = exports.createConfig = function createConfig(basePath, projectName) {
  return {
    uuid: _nodeUuid2.default.v4(),
    projectName: projectName,
    basePath: basePath
  };
};

// createDockDev :: object -> promise(object)
// initializes a new DockDev project by adding a .dockdev
var createDockDev = exports.createDockDev = function createDockDev(configObj) {
  return mkdir((0, _path.join)(configObj.basePath, config.folder));
};

// cleanConfigToWrite :: object -> string
// removes in-memory properties to write config to dockdev.json
// also JSON stringifies with indent formatting
var cleanConfigToWrite = _ramda2.default.compose(JSONStringifyPretty, _ramda2.default.pick(config.writeParams));

// writeConfig :: string -> function -> object -> promise(object)
// writes the config object to the specified path
// it will overwrite any existing file.
// should be used with readConfig for existing projects
var writeConfig = exports.writeConfig = function writeConfig(configObj) {
  return writeFile((0, _path.join)(configObj.basePath, config.path()), cleanConfigToWrite(configObj));
};

// addBasePath :: string -> string -> object
// takes a json string, parses it, and returns a new object with the basePath included
var addBasePath = function addBasePath(jsonObj, basePath) {
  return _ramda2.default.merge(JSON.parse(jsonObj), { basePath: basePath });
};

// readConfig :: string -> promise(object)
// given a base path it will return the parsed JSON file
var readConfig = exports.readConfig = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(basePath) {
  var configFile;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return readFile((0, _path.join)(basePath, config.path()));

        case 2:
          configFile = _context.sent;
          return _context.abrupt('return', addBasePath(configFile, basePath));

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
}));

// extendConfig :: object -> object
// accepts the existing config as first paramater
// and merges/overwrites with the second object
var extendConfig = _ramda2.default.merge;

// addConfigToMemory :: object -> object -> object
// adds the configObj for the project to the memory object
var addConfigToMemory = exports.addConfigToMemory = _ramda2.default.curry(function (memory, configObj) {
  memory[configObj.uuid] = configObj;
  return configObj;
});

var addToAppMemory = exports.addToAppMemory = addConfigToMemory(memory);

// initProject :: string -> string -> promise(object)
// combines the sequence of functions to initiate a new projects
// takes a path and a project name and returns the config object
var initProject = exports.initProject = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2(basePath, projectName) {
  var configObj;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          configObj = createConfig(basePath, projectName);
          _context2.next = 3;
          return createDockDev(configObj);

        case 3:
          _context2.next = 5;
          return writeConfig(configObj);

        case 5:

          addToAppMemory(configObj);

          return _context2.abrupt('return', configObj);

        case 7:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this);
}));

// cmdLine :: string -> string -> promise(string)
// returns the stdout of the command line call within a promise
var cmdLine = exports.cmdLine = _ramda2.default.curry(function (cmd, args) {
  return exec(cmd + ' ' + args);
});

// rsync :: string -> promise(string)
// accepts an array of cmd line args for rsync
// returns a promise that resolves to teh stdout
var rsync = exports.rsync = cmdLine('rsync');

// selectWithin :: [string] -> string -> object
// helper function to select specified props from a nested object
var selectWithin = _ramda2.default.curry(function (array, key, obj) {
  var result = {};
  array.forEach(function (val) {
    return result[val] = obj[key][val];
  });
  return result;
});

// createRsyncArgs :: string -> string -> object -> [string]
// accepts source, destination, and machine info
// returns an array of arguments for rsync
//** this should be redesigned to output just a string
var createRsyncArgs = _ramda2.default.curry(function (source, dest, machine) {
  var result = ['-a', '-e'];
  result.push('"ssh -i ' + machine.SSHKeyPath + ' -o IdentitiesOnly=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"');
  result.push('--delete');
  result.push(source);
  result.push('docker@' + machine.IPAddress + ':' + dest);
  return result;
});

// selectSSHandIP :: object -> object
// selects ssh and ip address from docker-machine inspect object
var selectSSHandIP = _ramda2.default.compose(selectWithin(['SSHKeyPath', 'IPAddress'], 'Driver'), JSON.parse);

// generateRsync :: object -> function
// accepts a config object and returns a function that is
// called when files change in the base directory of project
var generateRsync = exports.generateRsync = function generateRsync(config) {};

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